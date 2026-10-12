/* ==========================================================================
   CountriesIRL — the countries an applicant can pick (apply/)
   --------------------------------------------------------------------------
   [code, name, other names people might search for]. The code is the ISO
   3166 code, lower case, matching the flag files in assets/flags/: a member
   whose flag is assets/flags/fr.png takes France off the application list.
   England, Scotland, Wales and Northern Ireland use the codes flagcdn uses
   for them (gb-eng and so on), so the UK account does not take them too.

   Anything not here — a U.S. state, a region, a historical country — goes
   through "Not on the list" on the form instead.
   ========================================================================== */

window.APPLY_COUNTRIES = [
  ['af', 'Afghanistan'], ['al', 'Albania'], ['dz', 'Algeria'], ['ad', 'Andorra'],
  ['ao', 'Angola'], ['ag', 'Antigua and Barbuda'], ['ar', 'Argentina'], ['am', 'Armenia'],
  ['aw', 'Aruba'], ['au', 'Australia'], ['at', 'Austria'], ['az', 'Azerbaijan'],
  ['bs', 'Bahamas'], ['bh', 'Bahrain'], ['bd', 'Bangladesh'], ['bb', 'Barbados'],
  ['by', 'Belarus'], ['be', 'Belgium'], ['bz', 'Belize'], ['bj', 'Benin'],
  ['bm', 'Bermuda'], ['bt', 'Bhutan'], ['bo', 'Bolivia'], ['ba', 'Bosnia and Herzegovina', ['Bosnia']],
  ['bw', 'Botswana'], ['br', 'Brazil'], ['bn', 'Brunei'], ['bg', 'Bulgaria'],
  ['bf', 'Burkina Faso'], ['bi', 'Burundi'], ['kh', 'Cambodia'], ['cm', 'Cameroon'],
  ['ca', 'Canada'], ['cv', 'Cape Verde', ['Cabo Verde']], ['ky', 'Cayman Islands'],
  ['cf', 'Central African Republic'], ['td', 'Chad'], ['cl', 'Chile'], ['cn', 'China'],
  ['co', 'Colombia'], ['km', 'Comoros'], ['cr', 'Costa Rica'], ['ci', 'Côte d’Ivoire', ['Ivory Coast']],
  ['hr', 'Croatia'], ['cu', 'Cuba'], ['cw', 'Curaçao'], ['cy', 'Cyprus'],
  ['cz', 'Czechia', ['Czech Republic']], ['cd', 'DR Congo', ['Democratic Republic of the Congo', 'Congo-Kinshasa']],
  ['dk', 'Denmark'], ['dj', 'Djibouti'], ['dm', 'Dominica'], ['do', 'Dominican Republic'],
  ['ec', 'Ecuador'], ['eg', 'Egypt'], ['sv', 'El Salvador'], ['gb-eng', 'England'],
  ['gq', 'Equatorial Guinea'], ['er', 'Eritrea'], ['ee', 'Estonia'], ['sz', 'Eswatini', ['Swaziland']],
  ['et', 'Ethiopia'], ['fo', 'Faroe Islands'], ['fj', 'Fiji'], ['fi', 'Finland'],
  ['fr', 'France'], ['pf', 'French Polynesia'], ['ga', 'Gabon'], ['gm', 'Gambia'],
  ['ge', 'Georgia'], ['de', 'Germany'], ['gh', 'Ghana'], ['gi', 'Gibraltar'],
  ['gr', 'Greece'], ['gl', 'Greenland'], ['gd', 'Grenada'], ['gu', 'Guam'],
  ['gt', 'Guatemala'], ['gg', 'Guernsey'], ['gn', 'Guinea'], ['gw', 'Guinea-Bissau'],
  ['gy', 'Guyana'], ['ht', 'Haiti'], ['hn', 'Honduras'], ['hk', 'Hong Kong'],
  ['hu', 'Hungary'], ['is', 'Iceland'], ['in', 'India'], ['id', 'Indonesia'],
  ['ir', 'Iran'], ['iq', 'Iraq'], ['ie', 'Ireland'], ['im', 'Isle of Man'],
  ['il', 'Israel'], ['it', 'Italy'], ['jm', 'Jamaica'], ['jp', 'Japan'],
  ['je', 'Jersey'], ['jo', 'Jordan'], ['kz', 'Kazakhstan'], ['ke', 'Kenya'],
  ['ki', 'Kiribati'], ['xk', 'Kosovo'], ['kw', 'Kuwait'], ['kg', 'Kyrgyzstan'],
  ['la', 'Laos'], ['lv', 'Latvia'], ['lb', 'Lebanon'], ['ls', 'Lesotho'],
  ['lr', 'Liberia'], ['ly', 'Libya'], ['li', 'Liechtenstein'], ['lt', 'Lithuania'],
  ['lu', 'Luxembourg'], ['mo', 'Macau', ['Macao']], ['mg', 'Madagascar'], ['mw', 'Malawi'],
  ['my', 'Malaysia'], ['mv', 'Maldives'], ['ml', 'Mali'], ['mt', 'Malta'],
  ['mh', 'Marshall Islands'], ['mr', 'Mauritania'], ['mu', 'Mauritius'], ['mx', 'Mexico'],
  ['fm', 'Micronesia'], ['md', 'Moldova'], ['mc', 'Monaco'], ['mn', 'Mongolia'],
  ['me', 'Montenegro'], ['ma', 'Morocco'], ['mz', 'Mozambique'], ['mm', 'Myanmar', ['Burma']],
  ['na', 'Namibia'], ['nr', 'Nauru'], ['np', 'Nepal'], ['nl', 'Netherlands', ['Holland']],
  ['nc', 'New Caledonia'], ['nz', 'New Zealand'], ['ni', 'Nicaragua'], ['ne', 'Niger'],
  ['ng', 'Nigeria'], ['kp', 'North Korea'], ['mk', 'North Macedonia', ['Macedonia']],
  ['gb-nir', 'Northern Ireland'], ['no', 'Norway'], ['om', 'Oman'], ['pk', 'Pakistan'],
  ['pw', 'Palau'], ['ps', 'Palestine'], ['pa', 'Panama'], ['pg', 'Papua New Guinea'],
  ['py', 'Paraguay'], ['pe', 'Peru'], ['ph', 'Philippines'], ['pl', 'Poland'],
  ['pt', 'Portugal'], ['pr', 'Puerto Rico'], ['qa', 'Qatar'], ['cg', 'Republic of the Congo', ['Congo-Brazzaville']],
  ['ro', 'Romania'], ['ru', 'Russia'], ['rw', 'Rwanda'], ['kn', 'Saint Kitts and Nevis'],
  ['lc', 'Saint Lucia'], ['vc', 'Saint Vincent and the Grenadines'], ['ws', 'Samoa'], ['sm', 'San Marino'],
  ['st', 'São Tomé and Príncipe'], ['sa', 'Saudi Arabia'], ['gb-sct', 'Scotland'], ['sn', 'Senegal'],
  ['rs', 'Serbia'], ['sc', 'Seychelles'], ['sl', 'Sierra Leone'], ['sg', 'Singapore'],
  ['sk', 'Slovakia'], ['si', 'Slovenia'], ['sb', 'Solomon Islands'], ['so', 'Somalia'],
  ['za', 'South Africa'], ['kr', 'South Korea', ['Korea']], ['ss', 'South Sudan'], ['es', 'Spain'],
  ['lk', 'Sri Lanka'], ['sd', 'Sudan'], ['sr', 'Suriname'], ['se', 'Sweden'],
  ['ch', 'Switzerland'], ['sy', 'Syria'], ['tw', 'Taiwan'], ['tj', 'Tajikistan'],
  ['tz', 'Tanzania'], ['th', 'Thailand'], ['tl', 'Timor-Leste', ['East Timor']], ['tg', 'Togo'],
  ['to', 'Tonga'], ['tt', 'Trinidad and Tobago'], ['tn', 'Tunisia'], ['tr', 'Türkiye', ['Turkey']],
  ['tm', 'Turkmenistan'], ['tv', 'Tuvalu'], ['ug', 'Uganda'], ['ua', 'Ukraine'],
  ['ae', 'United Arab Emirates', ['UAE', 'Emirates']], ['gb', 'United Kingdom', ['UK', 'Britain', 'Great Britain']],
  ['us', 'United States', ['USA', 'America']], ['uy', 'Uruguay'], ['uz', 'Uzbekistan'], ['vu', 'Vanuatu'],
  ['va', 'Vatican City', ['Holy See']], ['ve', 'Venezuela'], ['vn', 'Vietnam'], ['gb-wls', 'Wales'],
  ['eh', 'Western Sahara'], ['ye', 'Yemen'], ['zm', 'Zambia'], ['zw', 'Zimbabwe']
];
