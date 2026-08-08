export const TOWN_ABBREVIATIONS = {
  Nyabugogo: 'NYB',
  Musanze: 'MUS',
  Ruhengeri: 'RUH',
  Byumba: 'BYU',
  Gicumbi: 'GIC',
  Huye: 'HUY',
  Muhanga: 'MUH',
  Nyanza: 'NYA',
  Butare: 'BUT',
  Rwamagana: 'RWM',
  Kayonza: 'KAY',
  Nyagatare: 'NYG',
  Kibungo: 'KIB',
  Rubavu: 'RBV',
  Karongi: 'KAR',
  Rusizi: 'RSZ',
  Gisenyi: 'GIS',
  Kimironko: 'KIM',
  Remera: 'REM',
  Ruhango: 'RHG',
  Nyamagabe: 'NYM',
  Nyaruguru: 'NYR',
}

export function abbreviateTown(name) {
  if (TOWN_ABBREVIATIONS[name]) return TOWN_ABBREVIATIONS[name]
  return name.slice(0, 3).toUpperCase()
}
