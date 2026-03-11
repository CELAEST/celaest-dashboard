import * as icons from '@phosphor-icons/react';
const matches = Object.keys(icons).filter(k => 
  k.toLowerCase().includes('pie') || k.toLowerCase().includes('chart')
);
console.log(matches.slice(0, 30).join('\n'));
