var spis = new Object();
spis.appName = 'SPIS TELEFONÓW';
spis.newNumbers = ['795099221'];

spis.ajax = function(_m, _a, _r, _3, _k) {
 var q = null;
 if (window.XMLHttpRequest) q = new XMLHttpRequest();
 else if (window.ActiveXObject) q = new ActiveXObject("Microsoft.XMLHTTP");
 q.open(_a, _m, !_k);
 q.onreadystatechange = function() {
  if (q.readyState == 4) _3.call(q);
 };
 q.send(_r);
 return q;
};

spis.isNew = function(num) {
 return (function check(x) { with (this) {
  return length ? x == this[0] || check.call(slice(1), x) : false;
 }}).call(spis.newNumbers, num);
}

spis.deleteLink = function(num) {
 let a = document.createElement('a');
 spis.setAttributeRec.call(a, ['href', 'javascript: void(0)', 'title', `USUŃ numer ${num} z tej tabeli.`]);
 with (a) {
  addEventListener('click', spis.delNumber);
  appendChild(document.createElement('img'));
  with (lastChild) {
   setAttribute('src', 'del.png');
   with (style) {
    width = '12px';
    height = '12px';
   }
  }
 }
 return a;
}

spis.removeChildrenRec = function() { with (this) {
 if (!childElementCount) return;
 removeChild(lastChild);
 spis.removeChildrenRec.call(this);
}}

spis.setAttributeRec = function(a) { with (a) {
 if (!length) return;
 this.setAttribute(a[0], a[1]);
 spis.setAttributeRec.call(this, slice(2)); 
}}

spis.refreshNumbers = function() { with (spis) {
 clearSearchBoxes();
 (function clearTable() { with (this) {
  if (!length) return;
  removeChildrenRec.call(this[0]);
  clearTable.call(slice(1));
 }}).call([...document.getElementsByClassName('numbers')]);
 loadNumbers();
}}

spis.appendNodes = function(n, k) {
 if (!k) return;
 this.appendChild(document.createElement(n));
 spis.appendNodes.call(this, n, k - 1);
}

spis.showNumbers = function() {
 let r = JSON.parse(this.responseText);
 let n = document.getElementsByClassName('numbers');
 for (let k = 0; 2 > k; ++k) { with (n[k]) {
  for (let i = 0; r[k].length > i; ++i) {
   appendChild(document.createElement('div'));
   spis.appendNodes.call(lastChild, 'div', 5);
   with (lastChild) {
    if (spis.isNew(r[k][i][3]))
        classList.add('newnumber');
    firstChild.appendChild(document.createTextNode(`${1 + i}.`));
    for (let x = 1; 3 > x; ++x)
         childNodes[x].appendChild(document.createTextNode(r[k][i][x]));
    with (childNodes[3]) {
     innerHTML =
       spis.format[k](r[k][i][3])
           .replace(/\S+/g, m => `<span>${m}</span>`);
     setAttribute('number', r[k][i][3]);
    }
    childNodes[4].appendChild(spis.deleteLink(r[k][i][3]));
   }
  }
  appendChild(document.createElement('div'));
  for (let c of ['LP', 'IMIĘ', 'NAZWISKO', 'NUMER TELEFONU', 'USUŃ']) { with (lastChild) {
   appendChild(document.createElement('div'));
   lastChild.appendChild(document.createTextNode(c));
  }}
 }}
}

spis.loadNumbers = function() {
 spis.ajax('tel.php', 'GET', null, spis.showNumbers, false);
}

spis.addNumber = function(fd) {
 spis.ajax('addtel.php', 'POST', fd, spis.handleAddResponse, false);
}

spis.resetForm = function() {
 with (document.forms[0]) {
  with (firstChild.lastChild.firstChild) {
   replaceChild(document.createTextNode('Numer Telefonu :'), firstChild);
  }
  reset();
  name.focus();
 }
 document.body.classList.remove('m');
}

spis.handleAddResponse = function() {
 const n = {
  'MOBILE': 'komórkowy',
  'LANDLINE': 'stacjonarny'
 };
 let r = JSON.parse(this.responseText);
 if (r.status == 'OK') {
  alert(`Wprowadzony numer został sklasyfikowany jako numer ${n[r.table]} oraz pomyślnie DODANY do tabeli \`${r.table}\` bazy danych.\nOczekuję na kolejny :)`);
  with (spis) {
   newNumbers.push(document.forms[0].number.value);
   refreshNumbers(); // reset after refreshing
   setTimeout(resetForm, 5000);
  }
 }
 else alert(`Nie udało się wprowadzić podanego numeru do bazy danych - nie przyjęła ona go niestety.\nPrzed kolejną próbą dodania tego numeru, proszę się najpierw upewnić, iż numeru nie ma jeszcze w bazie.`);
}

spis.handleDelResponse = function() {
 let r = JSON.parse(this.responseText);
 alert(`Wskazany numer ${r.status == 'OK' ? '' : 'nie '}został USUNIĘTY z bazy danych.`);
 if ('OK' == r.status)
     spis.refreshNumbers();
}

spis.delNumber = function() {
 let num = this.parentNode.previousSibling.getAttribute('number');
 if (!confirm(`Czy aby na pewno powinienem usunąć z listy numerów telefon\n${num}, należący do osoby " ${this.parentNode.parentNode.childNodes[1].firstChild.nodeValue} ${this.parentNode.parentNode.childNodes[2].firstChild.nodeValue} " ?`)) return;
 var fd = new FormData();
 fd.append('number', num);
 spis.ajax('deltel.php', 'POST', fd, spis.handleDelResponse, false);
}

spis.submitNumber = function() {
 var fd = new FormData();
 for (let n of this.querySelectorAll('[name]'))
      fd.append(n.getAttribute('name'), n.value);
 spis.addNumber(fd);
 return false;
}

spis.search = function(phrase) { with (this) {
 const r = (function testNodes(reg) { with (this) {
  return length ? testNodes.call(slice(1), reg) || reg.test(this[0].getAttribute('number') || this[0].firstChild.nodeValue) : false;
 }}).call([...querySelectorAll(':not(:first-child):not(:last-child)')], new RegExp(`^${phrase}`, 'i'));
 style.visibility = (!r ? 'hidden' : 'visible');
 return (parentNode.firstChild != this ? spis.search.call(previousSibling, phrase) : 0) +
        (!r ? 0 : 1);
}}

spis.clearSearchBoxes = function() {
 document.querySelector('body > p:first-of-type').style.visibility = 'hidden';
 (function resetValues() { with (this) {
  if (!length) return;
  this[0].value = '';
  resetValues.call(slice(1));
 }}).call([...document.querySelectorAll('[placeholder]')]);
}

spis.syncSearchBoxes = function() {
 (function syncBoxes(v) { with (this) {
  if (!length) return;
  this[0].value = v;
  syncBoxes.call(slice(1), v);
 }}).call([...document.querySelectorAll('[placeholder]')].filter(n => this != n), this.value);
}

spis.searchInput = function() { with (spis) {
 syncSearchBoxes.call(this);
 const n = document.querySelector('body > p:first-of-type');
 n.childNodes[1].replaceChild(document.createTextNode((function numbersFound(p) { with (this) {
  return length ? numbersFound.call(slice(1), p) + (1 < this[0].childElementCount ? search.call(this[0].lastChild.previousSibling, p) : 0) : 0;
 }}).call([...document.getElementsByClassName('numbers')], this.value)), n.childNodes[1].firstChild);
 n.style.visibility = this.value.length ? 'visible' : 'hidden';
}}

spis.revString = function(s) { with (s) {
 return length ? spis.revString(substr(1)) + charAt(0) : s;
}}

spis.formatNumber = function(n) { with (spis) {
 var i = 0;
 return revString(revString(this).replace(/\d/g, m => (!(function check(x) {
  with (this) { return length ? x == this[0] || check.call(slice(1), x) : false; }
 }).call(n, i++) ? '' : ' ') + m));
}}

spis.format = [
 num => spis.formatNumber.call(num, [2, 4, 7]),
 num => spis.formatNumber.call(num, [3, 6])
];

spis.searchBox = function() {
 let b = document.createElement('input');
 const nr = 1 + document.querySelectorAll('[placeholder]').length;
 const el = {
  'input': spis.searchInput,
  'mouseenter': function() { this.select(); },
  'mouseleave': function() { this.blur(); }
 };
 spis.setAttributeRec.call(b, ['type', 'text', 'placeholder', `${nr} WYSZUKIWANIE NR ${nr}`, 'title', `Bardzo proszę skorzystać z pola wyszukiwania nr ${nr} !`]);
 for (let e in el)
      b.addEventListener(e, el[e]);
 return b; 
}

spis.numberInput = function() {
 const l = /^1/.test(this.value);
 with (this.parentNode.previousSibling) {
  replaceChild(document.createTextNode(
   `Telefon ${l ? 'Stacjonarny' : 'Komórkowy'} :`
  ), firstChild);
 }
 document.body.classList[l ? 'remove' : 'add']('m');
}

spis.createForm = function() {
 let form = document.createElement('form');
 with (form) {
  onsubmit = spis.submitNumber;
  appendChild(document.createElement('div'));
  let i = {'name': 'Imię', 'surname': 'Nazwisko', 'number': 'Numer Telefonu'};
  for (let f in i) { with (lastChild) {
   appendChild(document.createElement('div'));
   with (lastChild) {
    appendChild(document.createElement('div'));
    lastChild.appendChild(document.createTextNode(`${i[f]} :`));
    appendChild(document.createElement('div'));
    with (lastChild) {
     appendChild(document.createElement('input'));
     let at = ['name', f, 'type', 'text', 'required', 'required'];
     with (lastChild) {
      if ('number' != f) {
       at.push('pattern', '\\w+');
       addEventListener('input', spis.addNumberInput);
      } else {
       at.push('pattern', '\\d{7,}');
       addEventListener('input', spis.numberInput);
      }
      addEventListener('mouseenter', function() { this.focus(); });
     }
     spis.setAttributeRec.call(lastChild, at);
    }
   }
  }}
  appendChild(document.createElement('p'));
  with (lastChild) {
   appendChild(document.createElement('input'));
   spis.setAttributeRec.call(lastChild, ['type', 'submit', 'value', 'DODAJ NUMER']);
  }
 }
 return form;
}

spis.addNumberInput = function() {
 this.value = this.value.replace(/^[a-z]/, function(m) {
  return m.toUpperCase();
 });
}

spis.print = function() {
 window.print();
}

spis.createDocument = function() {
 with (document.body) {
  appendChild(document.createElement('h1'));
  spis.appendNodes.call(lastChild, 'div', 3);
  with (lastChild) {
   with (childNodes[0]) {
    appendChild(document.createElement('button'));
    with (lastChild) {
     appendChild(document.createTextNode('WYDRUKUJ'));
     addEventListener('mouseenter', spis.print);
    }
   }
   childNodes[1].appendChild(document.createTextNode('SPIS'));
   childNodes[2].appendChild(document.createTextNode('TELEFONÓW'));
  }
  appendChild(document.createElement('p'));
  with (lastChild) {
   appendChild(document.createTextNode('Znaleziono '));
   appendChild(document.createElement('span'));
   lastChild.appendChild(document.createTextNode('-'));
   appendChild(document.createTextNode(' numerów telefonów !'));
  }
  appendChild(spis.searchBox());
  const t = {'landline': 'STACJONARNE', 'mobile': 'KOMÓRKOWE'};
  for (let s in t) {
   appendChild(document.createElement('p'));
   with (lastChild) {
    classList.add('tablename');
    appendChild(document.createTextNode('Telefony '));
    appendChild(document.createElement('span'));
    lastChild.appendChild(document.createTextNode(t[s]));
   }
   appendChild(document.createElement('div'));
   with (lastChild.classList) {
    add('numbers');
    add(s);
   }
  }
  insertBefore(spis.searchBox(), lastChild.previousSibling);
  appendChild(spis.searchBox());
  appendChild(document.createElement('fieldset'));
  with (lastChild) {
   appendChild(document.createElement('legend'));
   lastChild.appendChild(document.createTextNode('Dodawanie nowego numeru'));
   appendChild(spis.createForm());
  }
  appendChild(document.createElement('p'));
  with (lastChild) {
   for (let html of ['<span>Marek</span> Ponulak 1 EF-ZU', 'Aplikacje <span>Internetowe</span> 2021', '<span>Prowadzący</span> : dr inż. Tomasz <span>Rak</span>']) {
    appendChild(document.createElement('div'));
    lastChild.innerHTML = html;
   }
  }
 }
}

spis.load = function() {
 with (spis) {
  document.title = appName;
  createDocument();
 }
 setTimeout(function() {
  spis.loadNumbers();
  document.querySelector('[placeholder]').focus();
 }, 3000);
}

window.addEventListener('load', spis.load);
