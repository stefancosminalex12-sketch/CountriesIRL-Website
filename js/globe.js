/* ==========================================================================
   CountriesIRL — member globe
   --------------------------------------------------------------------------
   A slowly turning glass globe beside the hero copy, with every member lit.
   Members are read from window.SITE_CONFIG.members.list — the same list the
   cards and the flag strip use — so the globe can never disagree with them.
   Geography comes from data/globe.json (Natural Earth, public domain).
   It turns on its own; drag it (or swipe across it) to turn it by hand,
   and scroll or pinch to zoom in on it.

   How it draws: the world is painted once, flat, onto two canvases — one in
   colour, one where each member's area is filled with its own id — and both
   go to the GPU as textures. A single WebGL fragment shader then treats each
   pixel of the disc as a point on a sphere, turns it back into a longitude
   and latitude, and reads those textures. Clipping at the horizon, the far
   side showing through the glass and the lighting all come out of that one
   step. No library, and nothing fetched at runtime beyond the data file.
   ========================================================================== */

(function () {
  'use strict';

  var host = document.querySelector('[data-globe]');
  var config = window.SITE_CONFIG;
  if (!host) return;
  if (!config || !window.WebGLRenderingContext) {
    host.remove();
    return;
  }

  var DATA_URL = 'data/globe.json';
  var STATS_URL = 'data/stats.json';

  var DEG = Math.PI / 180;
  var TILT = 24;             // latitude facing the viewer, in degrees
  var START_LON = 18;        // opens over Europe, where the network started
  var SPIN = 360 / 120;      // degrees per second: one turn every two minutes
  var HOVER_ZOOM = 1.07;     // how far the globe leans in toward a hovered member
  var FILL = 0.42;           // globe radius as a share of the canvas, leaving room to lean in
  var REACH = 10;            // px a pointer may be from a point member and still hover it
  var REACH_TOUCH = 18;
  var TILT_MIN = -60;        // how far a drag may tip the globe to show the south…
  var TILT_MAX = 75;         // …and the north, short of turning it over
  var FRICTION = 2.6;        // how quickly a flick slows down, per second
  var MAX_FLICK = 420;       // fastest a flick can set it turning, degrees per second
  var RESUME_AFTER = 1600;   // ms after a drag before it turns on its own again
  var ZOOM_MIN = 0.8;        // smallest the globe can be made…
  var ZOOM_MAX = 6;          // …and closest in: microstates and U.S. states stand clear

  var STILL = window.matchMedia('(prefers-reduced-motion: reduce)');

  var members = ((config.members && config.members.list) || []).filter(function (m) {
    return m && m.name;
  });

  /* ----------------------------------------------------------------------
     Helpers
     ---------------------------------------------------------------------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /* assets/flags/ro.png → 'RO'. Custom flags (su.svg, Ohio.svg) give nothing,
     which is why those members say where they are with `geo`. */
  function isoFromFlag(flag) {
    var m = /\/([a-z]{2})\.(?:png|svg|jpe?g|webp)$/i.exec(flag || '');
    return m ? m[1].toUpperCase() : null;
  }

  function instagramHandle(member) {
    var links = member.links || [];
    for (var i = 0; i < links.length; i++) {
      var m = /instagram\.com\/([^\/?#]+)/i.exec((links[i] && links[i].url) || '');
      if (m) return m[1];
    }
    return null;
  }

  /* ----------------------------------------------------------------------
     Members → places on the globe
     --------------------------------------------------------------------
     One target per place. Usually that is one member; members who share a
     place (the Byzantine and Ottoman Empires, both at Constantinople) share
     a target, and its card lists them all.
     ---------------------------------------------------------------------- */

  function bbox(poly) {
    var b = [Infinity, Infinity, -Infinity, -Infinity];
    poly.forEach(function (rings) {
      rings.forEach(function (r) {
        for (var i = 0; i < r.length; i += 2) {
          if (r[i] < b[0]) b[0] = r[i];
          if (r[i] > b[2]) b[2] = r[i];
          if (r[i + 1] < b[1]) b[1] = r[i + 1];
          if (r[i + 1] > b[3]) b[3] = r[i + 1];
        }
      });
    });
    return b;
  }

  /* Where a card points: the centroid of the member's largest landmass, so
     France points at France rather than somewhere near French Guiana. */
  function centroid(poly) {
    var best = 0, at = null;
    poly.forEach(function (rings) {
      var r = rings[0], a = 0, cx = 0, cy = 0, n = r.length;
      for (var i = 0; i < n; i += 2) {
        var j = (i + 2) % n;
        var c = r[i] * r[j + 1] - r[j] * r[i + 1];
        a += c;
        cx += (r[i] + r[j]) * c;
        cy += (r[i + 1] + r[j + 1]) * c;
      }
      if (a !== 0 && Math.abs(a) > best) {
        best = Math.abs(a);
        at = [cx / (3 * a), cy / (3 * a)];
      }
    });
    return at || [poly[0][0][0], poly[0][0][1]];
  }

  /* Even-odd over every ring, so holes (Lesotho inside South Africa) count. */
  function contains(poly, lon, lat) {
    var inside = false;
    poly.forEach(function (rings) {
      rings.forEach(function (r) {
        for (var i = 0, j = r.length - 2; i < r.length; j = i, i += 2) {
          var yi = r[i + 1], yj = r[j + 1];
          if ((yi > lat) !== (yj > lat) &&
              lon < (r[j] - r[i]) * (lat - yi) / (yj - yi) + r[i]) {
            inside = !inside;
          }
        }
      });
    });
    return inside;
  }

  function buildTargets(data) {
    var countries = {}, states = {};
    data.countries.forEach(function (f) { if (f.i) countries[f.i] = f; });
    data.states.forEach(function (f) { states[f.i] = f; });

    var byKey = {}, list = [];

    members.forEach(function (member) {
      var geo = member.geo, target, key;

      /* Object form only: a string like 'US-AL' also has an `.at` — the
         built-in String method — so a plain truthiness check would take it
         for coordinates. */
      if (geo && typeof geo === 'object' && Array.isArray(geo.at)) {
        key = 'at:' + geo.at[0].toFixed(1) + ',' + geo.at[1].toFixed(1);
        target = { kind: 'point', at: geo.at };
      } else {
        var code = typeof geo === 'string' ? geo.toUpperCase() : isoFromFlag(member.flag);
        if (!code) return;
        if (states[code]) {
          key = 'state:' + code;
          target = { kind: 'state', poly: states[code].p };
        } else if (countries[code]) {
          key = 'country:' + code;
          target = { kind: 'country', poly: countries[code].p };
        } else if (data.points[code]) {
          key = 'point:' + code;
          target = { kind: 'point', at: data.points[code] };
        } else {
          return;
        }
      }

      if (byKey[key]) {
        byKey[key].members.push(member);
        if (member.origin) byKey[key].origin = true;
        return;
      }

      target.members = [member];
      target.origin = !!member.origin;
      target.id = list.length + 1;
      if (target.poly) {
        target.bbox = bbox(target.poly);
        target.anchor = centroid(target.poly);
      } else {
        target.anchor = target.at;
      }
      byKey[key] = target;
      list.push(target);
    });

    return list;
  }

  /* Follower counts are optional, and only ever real. A `followers` number
     on the member wins; otherwise the tracker's Instagram figure for the
     member's current handle, when it has one and it is exact. No figure, an
     estimate, or a figure filed under an old handle all show nothing — the
     card leaves the line off. Counts added later, in either place, appear
     without any change here. */
  function isCount(n) {
    return typeof n === 'number' && isFinite(n) && n > 0;
  }

  function indexStats(stats) {
    var byHandle = {};
    ((stats && stats.list) || []).forEach(function (row) {
      var ig = row && row.instagram;
      if (!ig || !ig.handle || ig.approximate || !isCount(ig.followers)) return;
      byHandle[String(ig.handle).toLowerCase()] = ig.followers;
    });
    return byHandle;
  }

  function followersOf(member, handle) {
    /* The member list is checked first. `followers: null` there means the
       account was checked and shows no count, so no other figure stands in. */
    if ('followers' in member) return isCount(member.followers) ? member.followers : null;
    var key = handle ? handle.toLowerCase() : '';
    return isCount(followerIndex[key]) ? followerIndex[key] : null;
  }

  /* ----------------------------------------------------------------------
     The world, painted flat
     ---------------------------------------------------------------------- */

  var COLOR = {
    land:       'rgba(232, 236, 242, 0.13)',
    border:     'rgba(232, 236, 242, 0.34)',
    /* Members wear the logo's blue (#012D78, hue 218°), lifted to a lighter
       and still saturated shade of the same hue so it carries on the dark
       glass. Fills sit deepest, outlines and markers brighter. */
    member:     'rgba(67, 127, 229, 0.44)',
    memberEdge: 'rgba(104, 155, 243, 0.7)',
    origin:     'rgba(81, 138, 236, 0.6)',
    state:      'rgba(83, 138, 234, 0.6)',
    stateEdge:  'rgba(130, 174, 247, 0.9)',
    point:      'rgba(111, 161, 246, 0.95)',
    pointGlow:  'rgba(85, 143, 241, 0.22)'
  };

  var KIND_ORDER = { country: 0, state: 1, point: 2 };

  function paint(data, list, W, ids) {
    var H = W / 2;
    var canvas = el('canvas');
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');
    var sx = W / 360, sy = H / 180, line = W / 2048;

    function trace(poly) {
      ctx.beginPath();
      poly.forEach(function (rings) {
        rings.forEach(function (r) {
          for (var i = 0; i < r.length; i += 2) {
            var x = (r[i] + 180) * sx, y = (90 - r[i + 1]) * sy;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.closePath();
        });
      });
    }

    /* Wider than tall by 1/cos(latitude), so it is round once on the sphere. */
    function disc(at, radius) {
      var stretch = 1 / Math.max(0.2, Math.cos(at[1] * DEG));
      ctx.beginPath();
      ctx.ellipse((at[0] + 180) * sx, (90 - at[1]) * sy,
        radius * sx * stretch, radius * sy, 0, 0, Math.PI * 2);
    }

    var ordered = list.slice().sort(function (a, b) {
      return KIND_ORDER[a.kind] - KIND_ORDER[b.kind];
    });

    if (ids) {
      /* Countries first, states over them, points over everything. */
      ordered.forEach(function (t) {
        ctx.fillStyle = 'rgb(' + t.id + ',0,0)';
        if (t.poly) trace(t.poly); else disc(t.at, 1.1);
        ctx.fill('evenodd');
      });
      return canvas;
    }

    ctx.lineJoin = 'round';

    ctx.fillStyle = COLOR.land;
    data.countries.forEach(function (f) { trace(f.p); ctx.fill('evenodd'); });

    ordered.forEach(function (t) {
      if (t.kind !== 'country') return;
      ctx.fillStyle = t.origin ? COLOR.origin : COLOR.member;
      trace(t.poly);
      ctx.fill('evenodd');
    });

    ctx.strokeStyle = COLOR.border;
    ctx.lineWidth = 0.8 * line;
    data.countries.forEach(function (f) { trace(f.p); ctx.stroke(); });

    ctx.strokeStyle = COLOR.memberEdge;
    ctx.lineWidth = 1.1 * line;
    ordered.forEach(function (t) {
      if (t.kind !== 'country') return;
      trace(t.poly);
      ctx.stroke();
    });

    ordered.forEach(function (t) {
      if (t.kind !== 'state') return;
      trace(t.poly);
      ctx.fillStyle = t.origin ? COLOR.origin : COLOR.state;
      ctx.fill('evenodd');
      ctx.strokeStyle = COLOR.stateEdge;
      ctx.lineWidth = 1.3 * line;
      ctx.stroke();
    });

    ordered.forEach(function (t) {
      if (t.kind !== 'point') return;
      ctx.fillStyle = COLOR.pointGlow;
      disc(t.at, 1.3);
      ctx.fill();
      ctx.fillStyle = COLOR.point;
      disc(t.at, 0.55);
      ctx.fill();
    });

    return canvas;
  }

  /* ----------------------------------------------------------------------
     WebGL
     ---------------------------------------------------------------------- */

  var VERT = 'attribute vec2 aPos; void main() { gl_Position = vec4(aPos, 0.0, 1.0); }';

  var FRAG = [
    'precision highp float;',
    'uniform vec2 uCenter;',
    'uniform float uRadius;',
    'uniform mat3 uRot;',
    'uniform sampler2D uColor;',
    'uniform sampler2D uIds;',
    'uniform vec2 uTexel;',
    'uniform float uHover;',
    'uniform float uHoverAmt;',
    'uniform vec2 uMid;',
    'uniform float uWin;',
    'uniform float uLens;',
    'const float PI = 3.141592653589793;',

    'vec2 uvOf(vec3 g) {',
    '  return vec2(atan(g.x, g.z) / (2.0 * PI) + 0.5, 0.5 - asin(clamp(g.y, -1.0, 1.0)) / PI);',
    '}',

    'void main() {',
    '  vec2 p = (gl_FragCoord.xy - uCenter) / uRadius;',
    '  float r = length(p);',
    '  float aa = 1.5 / uRadius;',

    // A thin, cool haze just outside the rim.
    '  float d = max(r - 1.0, 0.0);',
    '  float haze = (exp(-d * 26.0) * 0.13 + exp(-d * 8.0) * 0.035) * smoothstep(1.0 - aa, 1.0 + aa, r);',
    '  vec4 outside = vec4(vec3(0.74, 0.80, 0.88) * haze, haze);',
    '  vec4 result = outside;',
    '  if (r < 1.0 + aa) {',

    '  float z = sqrt(max(1.0 - r * r, 0.0));',
    '  vec3 n = vec3(p, z);',
    '  vec2 uvF = uvOf(uRot * n);',
    '  vec2 uvB = uvOf(uRot * vec3(p, -z));',

    // The far side, seen through the glass: faint and softened.
    '  vec4 back = 0.25 * (texture2D(uColor, uvB + vec2(uTexel.x, 0.0)) + texture2D(uColor, uvB - vec2(uTexel.x, 0.0))',
    '                    + texture2D(uColor, uvB + vec2(0.0, uTexel.y)) + texture2D(uColor, uvB - vec2(0.0, uTexel.y)));',
    '  vec4 col = back * 0.4;',

    // The glass: clear through the middle, catching light toward the rim.
    '  vec3 L = normalize(vec3(-0.45, 0.55, 0.72));',
    '  float diff = max(dot(n, L), 0.0);',
    '  float fres = pow(1.0 - z, 2.2);',
    '  vec3 glass = mix(vec3(0.075, 0.085, 0.10), vec3(0.15, 0.165, 0.19), diff * 0.8);',
    '  float ga = 0.28 + 0.34 * fres;',
    '  col = vec4(glass * ga, ga) + col * (1.0 - ga);',

    // The near side: land lit from the upper left; a hovered member brightens.
    '  vec4 land = texture2D(uColor, uvF);',
    '  float id = floor(texture2D(uIds, uvF).r * 255.0 + 0.5);',
    '  float hot = (uHover > 0.5 && abs(id - uHover) < 0.5) ? uHoverAmt : 0.0;',
    '  land.rgb *= 0.62 + 0.55 * diff;',
    '  land.rgb += land.a * hot * vec3(0.12, 0.22, 0.36);',
    '  land.a = min(1.0, land.a * (1.0 + 0.55 * hot));',
    '  col = land + col * (1.0 - land.a);',

    // Reflections: a soft specular bloom and a hairline of light at the rim.
    '  vec3 h = normalize(L + vec3(0.0, 0.0, 1.0));',
    '  float s = max(dot(n, h), 0.0);',
    '  float glow = pow(s, 60.0) * 0.26 + pow(s, 8.0) * 0.045 + pow(1.0 - z, 6.0) * 0.42;',
    '  col.rgb += vec3(0.92, 0.95, 1.0) * glow;',
    '  col.a = min(1.0, col.a + glow * 0.6);',

    '  float edge = 1.0 - smoothstep(1.0 - aa, 1.0, r);',
    '  result = col * edge + outside * (1.0 - edge);',
    '  }',

    // Everything is seen through a round window as wide as the canvas.
    // Zoomed in past it, the globe is seen as through a lens: a touch darker
    // toward the edge, with the same hairline of light as the globe's rim.
    '  float w = length(gl_FragCoord.xy - uMid);',
    '  float q = min(w / uWin, 1.0);',
    '  float zq = sqrt(1.0 - q * q);',
    '  result.rgb *= 1.0 - 0.3 * uLens * pow(1.0 - zq, 1.5);',
    '  float ring = uLens * pow(1.0 - zq, 6.0) * 0.42;',
    '  result.rgb += vec3(0.92, 0.95, 1.0) * ring;',
    '  result.a = min(1.0, result.a + ring * 0.6);',
    '  gl_FragColor = result * (1.0 - smoothstep(uWin - 1.5, uWin, w));',
    '}'
  ].join('\n');

  function setup(canvas) {
    var options = {
      alpha: true, premultipliedAlpha: true, antialias: false,
      depth: false, stencil: false, powerPreference: 'low-power'
    };
    var gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
    if (!gl) return null;

    var frag = FRAG;
    var high = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    if (!high || high.precision === 0) frag = frag.replace('precision highp float;', 'precision mediump float;');

    function shader(type, source) {
      var s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }

    var program = gl.createProgram();
    gl.attachShader(program, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var u = {};
    ['uCenter', 'uRadius', 'uRot', 'uColor', 'uIds', 'uTexel', 'uHover', 'uHoverAmt',
     'uMid', 'uWin', 'uLens'].forEach(function (name) {
      u[name] = gl.getUniformLocation(program, name);
    });
    gl.uniform1i(u.uColor, 0);
    gl.uniform1i(u.uIds, 1);

    return { gl: gl, u: u };
  }

  /* REPEAT across the date line needs power-of-two sizes, which both are. */
  function upload(gl, unit, source, exact) {
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !exact);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    var filter = exact ? gl.NEAREST : gl.LINEAR;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  }

  /* ----------------------------------------------------------------------
     Sphere maths — view space is x right, y up, the viewer on +z
     ---------------------------------------------------------------------- */

  /* View → globe, row-major: turn to the longitude facing the viewer, then
     tip to the latitude facing them. */
  function rotation(lon, lat) {
    var l = lon * DEG, f = lat * DEG;
    var cl = Math.cos(l), sl = Math.sin(l), cf = Math.cos(f), sf = Math.sin(f);
    return [cl, -sl * sf, sl * cf, 0, cf, sf, -sl, -cl * sf, cl * cf];
  }

  function clampTilt(lat) {
    return Math.max(TILT_MIN, Math.min(TILT_MAX, lat));
  }

  /* Turn the globe so the place `ll` sits at screen point `at`, or as near
     as the tilt limits allow. A few small corrections converge on it. */
  function hold(ll, at) {
    for (var i = 0; i < 3; i++) {
      var g = geometry(), s = project(ll, rotation(state.lon, state.lat), g);
      if (!s.front) return;
      var c = Math.max(0.25, Math.cos(ll[1] * DEG));
      state.lon += (s.x - at.x) / (g.r * c) / DEG;
      state.lat = clampTilt(state.lat - (s.y - at.y) / g.r / DEG);
    }
  }

  function project(at, M, g) {
    var lo = at[0] * DEG, la = at[1] * DEG;
    var x = Math.cos(la) * Math.sin(lo), y = Math.sin(la), z = Math.cos(la) * Math.cos(lo);
    var vx = M[0] * x + M[3] * y + M[6] * z;
    var vy = M[1] * x + M[4] * y + M[7] * z;
    var vz = M[2] * x + M[5] * y + M[8] * z;
    return { x: g.cx + g.r * vx, y: g.cy - g.r * vy, front: vz > 0 };
  }

  function unproject(px, py, M, g) {
    var vx = (px - g.cx) / g.r, vy = (g.cy - py) / g.r, r2 = vx * vx + vy * vy;
    if (r2 > 1) return null;
    var vz = Math.sqrt(1 - r2);
    var x = M[0] * vx + M[1] * vy + M[2] * vz;
    var y = M[3] * vx + M[4] * vy + M[5] * vz;
    var z = M[6] * vx + M[7] * vy + M[8] * vz;
    return [Math.atan2(x, z) / DEG, Math.asin(Math.max(-1, Math.min(1, y))) / DEG];
  }

  /* ----------------------------------------------------------------------
     State
     ---------------------------------------------------------------------- */

  var canvas = el('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  var card = el('div', 'globe-card');
  card.setAttribute('aria-hidden', 'true');
  host.append(canvas, card);

  var gfx = null, data = null, targets = [], followerIndex = {};
  var ready = false, visible = true, raf = 0, last = 0;
  var view = { css: 1, k: 1 };

  var state = {
    lon: START_LON,
    lat: TILT,
    speed: STILL.matches ? 0 : SPIN,
    vLon: 0,            // what a flick left behind, degrees per second
    vLat: 0,
    drag: null,         // the mouse, pen or finger holding the globe
    resumeAt: 0,        // when it may start turning on its own again
    scale: 1,           // the zoom on screen…
    userZoom: 1,        // …and the zoom asked for, which it eases toward
    zoomAt: null,       // screen point a zoom holds still
    touches: {},        // fingers down on the globe, by pointer id
    pinch: null,
    pinchHeld: false,   // a pinch's fingers keep the page still until the last lifts
    zoom: 1,            // the lean toward a hovered member
    hoverAmt: 0,
    hover: null,        // the target under the pointer, or tapped
    lit: null,          // the target the shader is (or was last) brightening
    shown: null,        // the target the card is showing
    focus: null,        // screen point the globe leans toward
    pointer: null,
    tap: null,
    touch: false
  };

  function geometry() {
    var size = view.css, c0 = size / 2, r0 = size * FILL * state.scale;
    var f = state.focus || { x: c0, y: c0 };
    return {
      cx: f.x + (c0 - f.x) * state.zoom, cy: f.y + (c0 - f.y) * state.zoom,
      r: r0 * state.zoom, win: c0 - 1
    };
  }

  /* The same without the lean toward a hovered member. */
  function baseGeometry() {
    var size = view.css;
    return { cx: size / 2, cy: size / 2, r: size * FILL * state.scale, win: size / 2 - 1 };
  }

  /* The globe is seen through a round window as wide as the canvas: however
     far it is zoomed, nothing outside that circle shows or can be picked. */
  function inWindow(p) {
    var c = view.css / 2;
    return Math.hypot(p.x - c, p.y - c) <= c - 1;
  }

  function measure() {
    var width = host.getBoundingClientRect().width || 1;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var px = Math.max(2, Math.round(width * dpr));
    if (canvas.width !== px) {
      canvas.width = px;
      canvas.height = px;
    }
    view.css = width;
    view.k = px / width;
  }

  /* ----------------------------------------------------------------------
     Picking
     ---------------------------------------------------------------------- */

  /* The member whose outline is under a longitude and latitude: states
     first, since they sit on top of the country around them. */
  function areaAt(ll) {
    var kinds = ['state', 'country'];
    for (var k = 0; k < kinds.length; k++) {
      for (var i = 0; i < targets.length; i++) {
        var t = targets[i], b = t.bbox;
        if (t.kind !== kinds[k]) continue;
        if (ll[0] < b[0] || ll[0] > b[2] || ll[1] < b[1] || ll[1] > b[3]) continue;
        if (contains(t.poly, ll[0], ll[1])) return t;
      }
    }
    return null;
  }

  function nearest(kind, px, py, reach, M, g) {
    var best = null, bestD = reach;
    targets.forEach(function (t) {
      if (kind === 'point' ? t.kind !== 'point' : !t.poly) return;
      var s = project(t.anchor, M, g);
      if (!s.front || !inWindow(s)) return;
      var dist = Math.hypot(s.x - px, s.y - py);
      if (dist < bestD) { bestD = dist; best = t; }
    });
    return best;
  }

  function pick(px, py, M, g) {
    if (!inWindow({ x: px, y: py })) return null;
    /* Zoomed in, markers are drawn bigger, and are that much easier to hit. */
    var reach = Math.max(state.touch ? REACH_TOUCH : REACH, g.r * 0.9 * DEG);
    var ll = unproject(px, py, M, g);
    var area = ll ? areaAt(ll) : null;

    /* A marker (Rome, San Marino, Prague) beats the land around it — but over
       another member's own land only close up, so the Czechoslovakia marker
       at Prague leaves the rest of Czechia to the Czech Republic. Over sea or
       non-member land a marker keeps its full reach, so microstates stay easy
       to hit. */
    var point = nearest('point', px, py, area ? reach * 0.55 : reach, M, g);
    if (point) return point;
    if (area) return area;

    /* A near miss on a small country still counts. */
    return ll ? nearest('poly', px, py, reach, M, g) : null;
  }

  /* ----------------------------------------------------------------------
     The card
     ---------------------------------------------------------------------- */

  var cardSize = { w: 0, h: 0 }, hideTimer = 0, tapTimer = 0, lastTap = null;

  function fillCard(t) {
    card.replaceChildren.apply(card, t.members.map(function (m) {
      var row = el('div', 'globe-card__row');
      if (m.flag) {
        var flag = el('img', 'globe-card__flag');
        flag.src = m.flag;
        flag.alt = '';
        flag.width = 28;
        flag.height = 19;
        flag.onerror = function () { flag.remove(); };
        row.append(flag);
      }

      var text = el('div');
      text.append(el('p', 'globe-card__name', m.name));
      var handle = instagramHandle(m);
      if (handle) text.append(el('p', 'globe-card__meta', '@' + handle));
      var followers = followersOf(m, handle);
      if (followers !== null) {
        text.append(el('p', 'globe-card__meta', followers.toLocaleString('en-GB') + ' followers'));
      }

      row.append(text);
      return row;
    }));
    cardSize.w = card.offsetWidth;
    cardSize.h = card.offsetHeight;
  }

  function showCard(t) {
    clearTimeout(hideTimer);
    if (t) {
      if (state.shown !== t) fillCard(t);
      state.shown = t;
      card.classList.add('is-on');
    } else if (state.shown) {
      card.classList.remove('is-on');
      hideTimer = setTimeout(function () { state.shown = null; }, 250);
    }
  }

  function placeCard(M, g) {
    var t = state.shown;
    if (!t) return;
    /* By the member's own spot — or, when that is round the back or zoomed
       out of the window, by the pointer or the tap. */
    var s = project(t.anchor, M, g), seen = s.front && inWindow(s);
    var at = state.pointer || lastTap;
    var x = seen ? s.x : (at ? at.x : g.cx);
    var y = seen ? s.y : (at ? at.y : g.cy);
    var size = view.css, w = cardSize.w, h = cardSize.h;

    var left = x + 14, top = y - h - 10;
    if (left + w > size) left = x - w - 14;   // flip to the left of the region
    if (top < 0) top = y + 14;                // or below it, near the top edge
    left = Math.max(0, Math.min(size - w, left));
    top = Math.max(0, Math.min(size - h, top));
    card.style.transform = 'translate(' + Math.round(left) + 'px, ' + Math.round(top) + 'px)';
  }

  /* ----------------------------------------------------------------------
     Frame loop
     ---------------------------------------------------------------------- */

  function kick() {
    if (!raf && ready && visible && !document.hidden) raf = window.requestAnimationFrame(frame);
  }

  function frame(now) {
    raf = 0;
    var dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    var still = STILL.matches;
    function ease(rate) { return still ? 1 : 1 - Math.exp(-dt * rate); }

    var dragging = !!(state.drag && state.drag.active);
    var pinching = !!state.pinch;
    var coasting = Math.abs(state.vLon) + Math.abs(state.vLat) > 6;
    var resting = now < state.resumeAt;

    /* Zoom: eased toward what the wheel asked for, direct under the fingers,
       and always about the pointer — the place under it stays under it, so
       zooming in goes to whatever the pointer is on. */
    if (state.scale !== state.userZoom) {
      var at = state.zoomAt;
      var ll = at && unproject(at.x, at.y, rotation(state.lon, state.lat), geometry());
      state.scale += (state.userZoom - state.scale) * (pinching ? 1 : ease(14));
      if (Math.abs(state.userZoom - state.scale) < 0.0005) state.scale = state.userZoom;
      if (ll) hold(ll, at);
      if (state.scale === state.userZoom) state.zoomAt = null;
    }
    var M = rotation(state.lon, state.lat);

    /* Who is under the pointer — or under the last tap on a touch screen.
       Nobody while the globe is in someone's hand or still coasting from a
       flick: cards flashing past would only get in the way. */
    if (dragging || pinching || coasting) {
      state.hover = null;
    } else if (state.tap) {
      state.hover = pick(state.tap.x, state.tap.y, M, geometry());
      lastTap = state.tap;
      state.tap = null;
      clearTimeout(tapTimer);
      if (state.hover) tapTimer = setTimeout(function () { state.hover = null; kick(); }, 4500);
    } else if (!state.touch) {
      state.hover = state.pointer ? pick(state.pointer.x, state.pointer.y, M, geometry()) : null;
    }
    if (state.hover) state.lit = state.hover;
    showCard(state.hover);

    /* Turning on its own pauses while a member is under the pointer, so it
       stays there, and while the globe is held — then, a moment after it is
       let go, it picks up again gently. West to east, the way the Earth
       turns: the land drifts left to right, so the view moves on west. */
    var wantSpeed = state.hover || still || dragging || pinching || resting ? 0 : SPIN;
    state.speed += (wantSpeed - state.speed) * ease(wantSpeed > state.speed ? 1.2 : 3);
    /* Zoomed in, it turns that much slower, so the land drifts past at the
       same unhurried pace. */
    state.lon -= state.speed * dt / Math.max(1, state.scale);

    /* A flick carries on by itself and slows to a stop. */
    if (!dragging && (state.vLon || state.vLat)) {
      var decay = Math.exp(-dt * FRICTION);
      var tipped = state.lat + state.vLat * dt;
      state.lon += state.vLon * dt;
      state.lat = clampTilt(tipped);
      if (state.lat !== tipped) state.vLat = 0;
      state.vLon *= decay;
      state.vLat *= decay;
      if (Math.abs(state.vLon) < 0.3) state.vLon = 0;
      if (Math.abs(state.vLat) < 0.3) state.vLat = 0;
    }

    /* Once it turns on its own again, it settles back to its usual tilt. */
    if (!dragging && !resting && !state.hover && !still) {
      state.lat += (TILT - state.lat) * ease(0.6);
    }

    /* The lean in is for the whole globe; zoomed in, it would only nudge the
       map about under the pointer, so it fades away. */
    var lean = (HOVER_ZOOM - 1) / Math.max(1, state.scale * state.scale);
    var wantZoom = state.hover && !state.touch ? 1 + lean : 1;
    state.zoom += (wantZoom - state.zoom) * ease(5);
    state.hoverAmt += ((state.hover ? 1 : 0) - state.hoverAmt) * ease(10);

    /* Lean in about the member's own spot, so it stays under the pointer. */
    if (state.hover) {
      var a = project(state.hover.anchor, rotation(state.lon, state.lat), baseGeometry());
      var goal = a.front && inWindow(a) ? a : state.pointer;
      if (goal) {
        if (!state.focus) state.focus = { x: goal.x, y: goal.y };
        state.focus.x += (goal.x - state.focus.x) * ease(8);
        state.focus.y += (goal.y - state.focus.y) * ease(8);
      }
    } else if (state.zoom < 1.0005) {
      state.focus = null;
    }

    M = rotation(state.lon, state.lat);
    var g = geometry();
    render(M, g);
    placeCard(M, g);
    if (state.userZoom > 1.5 && !gfx.detail) sharpen();

    if (!host.classList.contains('is-ready')) host.classList.add('is-ready');

    var busy = state.speed > 0.001 || dragging || pinching || resting || state.vLon || state.vLat ||
      state.scale !== state.userZoom ||
      Math.abs(state.zoom - wantZoom) > 0.0005 ||
      Math.abs(state.hoverAmt - (state.hover ? 1 : 0)) > 0.002 || state.pointer;
    if (busy) kick();
  }

  function render(M, g) {
    var gl = gfx.gl, u = gfx.u, px = canvas.width, k = view.k;
    gl.viewport(0, 0, px, px);
    gl.uniform2f(u.uCenter, g.cx * k, px - g.cy * k);
    gl.uniform1f(u.uRadius, g.r * k);
    gl.uniformMatrix3fv(u.uRot, false, [M[0], M[3], M[6], M[1], M[4], M[7], M[2], M[5], M[8]]);
    gl.uniform1f(u.uHover, state.lit ? state.lit.id : 0);
    gl.uniform1f(u.uHoverAmt, state.hoverAmt);
    gl.uniform2f(u.uMid, px / 2, px / 2);
    gl.uniform1f(u.uWin, g.win * k);
    gl.uniform1f(u.uLens, Math.max(0, Math.min(1, (g.r / g.win - 0.95) / 0.3)));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  /* ----------------------------------------------------------------------
     Start-up
     ---------------------------------------------------------------------- */

  function build() {
    gfx = setup(canvas);
    if (!gfx) throw new Error('WebGL is not available');
    gfx.textures = [];
    paintTextures(false);
  }

  /* Sharp enough for the globe's size on this screen, and no larger — until
     someone zooms in, when the world is painted again in full detail. */
  function paintTextures(detail) {
    var gl = gfx.gl;
    var radius = canvas.width * FILL * HOVER_ZOOM * (detail ? ZOOM_MAX : 1);
    var max = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    var W = 2 * Math.PI * radius > 2300 && max >= 4096 ? 4096 : 2048;

    var colour = paint(data, targets, W, false);
    var ids = paint(data, targets, detail ? W : 2048, true);
    gfx.textures.forEach(function (t) { gl.deleteTexture(t); });
    gfx.textures = [upload(gl, 0, colour, false), upload(gl, 1, ids, true)];
    colour.width = ids.width = 0;           // the pixels live on the GPU now
    gl.uniform2f(gfx.u.uTexel, 1.5 / W, 1.5 / (W / 2));
    gfx.detail = detail;
  }

  function sharpen() {
    gfx.detail = true;                      // once only, even while it paints
    setTimeout(function () {
      try { paintTextures(true); } catch (error) { console.warn('CountriesIRL: globe detail —', error.message); }
      kick();
    }, 50);
  }

  function fail(error) {
    if (error) console.warn('CountriesIRL: globe unavailable —', error.message || error);
    ready = false;
    host.remove();
  }

  function json(response) {
    if (!response.ok) throw new Error(response.url + ' ' + response.status);
    return response.json();
  }

  function init() {
    measure();
    Promise.all([
      fetch(DATA_URL).then(json),
      fetch(STATS_URL, { cache: 'no-cache' }).then(json).catch(function () { return null; })
    ]).then(function (results) {
      data = results[0];
      followerIndex = indexStats(results[1]);
      targets = buildTargets(data);
      build();
      host.setAttribute('aria-label',
        'Globe highlighting where the ' + members.length + ' CountriesIRL members are');
      ready = true;
      kick();
    }).catch(fail);
  }

  canvas.addEventListener('webglcontextlost', function (event) {
    event.preventDefault();
    ready = false;
  });
  canvas.addEventListener('webglcontextrestored', function () {
    try { build(); ready = true; kick(); } catch (error) { fail(error); }
  });

  /* Mouse and pen: hover to see a member, drag to turn the globe. Touch: tap
     to see a member, swipe across to turn it. A swipe that starts upright
     still scrolls the page (touch-action: pan-y in the stylesheet) — the
     browser takes that one over and says so with pointercancel. */
  function local(event) {
    var r = canvas.getBoundingClientRect();
    return { x: event.clientX - r.left, y: event.clientY - r.top };
  }

  function onGlobe(p) {
    var g = baseGeometry();
    return Math.hypot(p.x - g.cx, p.y - g.cy) <= Math.min(g.r * 1.1, g.win);
  }

  function clampFlick(v) {
    return Math.max(-MAX_FLICK, Math.min(MAX_FLICK, v));
  }

  function dragMove(event) {
    var d = state.drag, p = local(event);
    if (!d.active) {
      var ox = p.x - d.x, oy = p.y - d.y;
      if (Math.hypot(ox, oy) < (d.touch ? 10 : 4)) return;
      /* On a touch screen a swipe that starts upright belongs to the page. */
      if (d.touch && Math.abs(oy) > Math.abs(ox)) {
        state.drag = null;
        return;
      }
      d.active = true;
      d.trail = [{ t: d.t0, lon: state.lon, lat: state.lat }];
      d.grab = unproject(d.x, d.y, rotation(state.lon, state.lat), geometry());
      state.speed = 0;
      state.hover = null;
      clearTimeout(tapTimer);
      host.classList.add('is-dragging');
    }
    /* The spot that was grabbed stays under the pointer, worked out exactly
       so it holds at any zoom and latitude. Off the edge of the globe there
       is no spot to hold, and a globe radius of travel turns it a radian. */
    var g = geometry(), inside = Math.hypot(p.x - g.cx, p.y - g.cy) < g.r * 0.95;
    if (d.grab && inside) {
      hold(d.grab, p);
    } else {
      var r = baseGeometry().r;
      state.lon -= (p.x - d.x) / r / DEG;
      state.lat = clampTilt(state.lat + (p.y - d.y) / r / DEG);
    }
    d.grab = inside ? unproject(p.x, p.y, rotation(state.lon, state.lat), geometry()) : null;
    d.x = p.x;
    d.y = p.y;
    var t = performance.now();
    d.trail.push({ t: t, lon: state.lon, lat: state.lat });
    while (d.trail.length > 2 && t - d.trail[0].t > 100) d.trail.shift();
    kick();
  }

  /* Returns whether the press had become a drag. */
  function letGo(cancelled) {
    var d = state.drag;
    state.drag = null;
    host.classList.remove('is-dragging');
    if (!d.active) return false;
    var now = performance.now(), a = d.trail[0], b = d.trail[d.trail.length - 1];
    /* Only a pointer still moving as it lets go leaves a flick behind. */
    if (!cancelled && !STILL.matches && now - b.t < 80 && b.t > a.t) {
      var span = (b.t - a.t) / 1000;
      state.vLon = clampFlick((b.lon - a.lon) / span);
      state.vLat = clampFlick((b.lat - a.lat) / span);
    }
    state.resumeAt = now + RESUME_AFTER;
    kick();
    return true;
  }

  function zoomTo(z, at) {
    state.userZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));
    state.zoomAt = at;
    state.speed = 0;
    state.vLon = state.vLat = 0;
    state.resumeAt = performance.now() + RESUME_AFTER;
    kick();
  }

  /* Two fingers on a touch screen: spreading them zooms about the point
     between them, and moving them together turns the globe. */
  function fingers() {
    return Object.keys(state.touches).map(function (id) { return state.touches[id]; });
  }
  function spread(pts) { return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y); }
  function middle(pts) { return { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }; }

  function startPinch() {
    var pts = fingers();
    state.drag = null;                    // the first finger's drag or tap is off
    host.classList.remove('is-dragging');
    state.touch = true;
    state.hover = null;
    clearTimeout(tapTimer);
    state.pinch = { spread: Math.max(spread(pts), 20), zoom: state.userZoom, mid: middle(pts) };
    state.pinchHeld = true;
    kick();
  }

  function pinchMove() {
    var pts = fingers(), P = state.pinch, mid = middle(pts), r = baseGeometry().r;
    state.lon -= (mid.x - P.mid.x) / r / DEG;
    state.lat = clampTilt(state.lat + (mid.y - P.mid.y) / r / DEG);
    P.mid = mid;
    zoomTo(P.zoom * spread(pts) / P.spread, mid);
  }

  /* A finger lifting ends a pinch; the one left behind neither turns the
     globe nor counts as a tap. */
  function lift(event) {
    if (!state.touches[event.pointerId]) return;
    delete state.touches[event.pointerId];
    if (!fingers().length) state.pinchHeld = false;
    if (state.pinch) {
      state.pinch = null;
      state.resumeAt = performance.now() + RESUME_AFTER;
      kick();
    }
  }

  canvas.addEventListener('pointerdown', function (event) {
    if (!ready || (event.pointerType === 'mouse' && event.button !== 0)) return;
    var p = local(event), touch = event.pointerType === 'touch';
    if (touch) {
      state.touches[event.pointerId] = p;
      var count = fingers().length;
      if (count === 2) startPinch();
      if (count > 1) return;
    }
    if (!onGlobe(p)) {
      if (touch && state.hover) { state.hover = null; kick(); }
      return;
    }
    state.vLon = state.vLat = 0;          // a hand on the globe stops a flick
    state.drag = {
      id: event.pointerId, touch: touch, active: false,
      x: p.x, y: p.y, t0: performance.now(), trail: null
    };
    if (!touch) canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', function (event) {
    if (state.touches[event.pointerId]) {
      state.touches[event.pointerId] = local(event);
      if (state.pinch) pinchMove();
    }
    if (state.drag && state.drag.id === event.pointerId) dragMove(event);
    if (event.pointerType === 'touch') return;
    state.touch = false;
    state.pointer = local(event);
    host.classList.toggle('is-grabbable', onGlobe(state.pointer));
    kick();
  });
  canvas.addEventListener('pointerleave', function (event) {
    if (event.pointerType === 'touch') return;
    state.pointer = null;
    host.classList.remove('is-grabbable');
    kick();
  });
  canvas.addEventListener('pointerup', function (event) {
    lift(event);
    var d = state.drag;
    if (!d || d.id !== event.pointerId) return;
    if (letGo(false) || !d.touch) return;
    /* A finger that barely moved was a tap. */
    state.touch = true;
    state.pointer = null;
    state.tap = local(event);
    kick();
  });
  ['pointercancel', 'lostpointercapture'].forEach(function (type) {
    canvas.addEventListener(type, function (event) {
      if (type === 'pointercancel') lift(event);
      if (state.drag && state.drag.id === event.pointerId) letGo(true);
    });
  });

  /* Two fingers on the globe are the globe's, from the moment the second
     one lands until the last one lifts: the page neither scrolls nor zooms
     underneath — not once the globe reaches its smallest or largest size,
     and not for a finger left behind when the other lifts first. A single
     finger keeps the page's vertical scroll (touch-action: pan-y). */
  function holdTouches(event) {
    if ((event.targetTouches.length > 1 || state.pinch || state.pinchHeld) && event.cancelable) {
      event.preventDefault();
    }
  }
  canvas.addEventListener('touchstart', holdTouches, { passive: false });
  canvas.addEventListener('touchmove', holdTouches, { passive: false });

  /* The wheel. Over the globe it belongs to the globe: it zooms, and at
     either limit it simply stops — the page never scrolls, zooms or swipes
     sideways underneath. A trackpad pinch arrives as a wheel with Ctrl held,
     as does Ctrl + wheel. Off the globe (the empty corners of its box too)
     the page scrolls as usual, and so does a page scroll that was already
     under way when the pointer drifted onto the globe. */
  var scrolledAt = 0;
  window.addEventListener('scroll', function () { scrolledAt = performance.now(); }, { passive: true });

  canvas.addEventListener('wheel', function (event) {
    if (!ready) return;
    var p = local(event);
    if (!onGlobe(p)) return;
    if (!event.ctrlKey && performance.now() - scrolledAt < 300) return;
    event.preventDefault();
    var dy = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 400 : 1);
    if (dy) zoomTo(state.userZoom * Math.exp(-dy * (event.ctrlKey ? 0.01 : 0.002)), p);
  }, { passive: false });

  /* Safari on a Mac reports a trackpad pinch as gesture events instead. On
     iPhone and iPad the fingers are already handled above. */
  var gestureFrom = 0;
  canvas.addEventListener('gesturestart', function (event) {
    event.preventDefault();
    gestureFrom = fingers().length ? 0 : state.userZoom;
  });
  canvas.addEventListener('gesturechange', function (event) {
    event.preventDefault();
    if (gestureFrom) zoomTo(gestureFrom * event.scale, local(event));
  });
  document.addEventListener('pointerdown', function (event) {
    if (state.touch && state.hover && !host.contains(event.target)) {
      state.hover = null;
      kick();
    }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      kick();
    }).observe(host);
  }
  document.addEventListener('visibilitychange', function () {
    last = 0;
    kick();
  });
  STILL.addEventListener('change', kick);
  if ('ResizeObserver' in window) {
    new ResizeObserver(function () {
      measure();
      kick();
    }).observe(host);
  }

  /* Wait for the page to finish and go quiet: the globe is the last thing the
     first screen needs, never the thing that holds it up. */
  function whenIdle(fn) {
    var idle = window.requestIdleCallback || function (cb) { return setTimeout(cb, 200); };
    function go() { idle(function () { try { fn(); } catch (error) { fail(error); } }, { timeout: 2000 }); }
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
  }

  whenIdle(init);
})();
