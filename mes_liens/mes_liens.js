/*function trier (list, arg){
    if (list.length === 2){
        if (list[0][arg] > list[1][arg]){
            return [list[1], list[0]];
        } else {
            return list;
        }
     } else {
        if (list[0][arg] > list[1][arg]){
            return [list[1], list[0]];
        } else {
            return list;
        }
    }
 }
liens.sort(function(a,b) {return a['url']<b['url'] ? -1 : (a['url']===b['url'] ? 0 : 1)})
function keep_items (list, pred){
    if (list.length === 1){
        return pred(list[0]) ? list : [];
    } else {        */
//∆∇

let divliens = document.getElementById('liens'),
    classes = [],
    db = new PouchDB('liens'),
    liens,
    ids = [],
    numberRows,
    cancelButton = document.getElementById('annul_modif'),
    deleteWhileModifyingButton = document.getElementById('supprimer_pendant_modif'),
    submitButton = document.getElementById('submit'),
    buttonMontrer = document.getElementById('montrer'),
    entreeTitre = document.getElementById('titre'),
    entreeUrl = document.getElementById('url'),
    entreeClasse = document.getElementById('classe'),
    divAjout = document.getElementById('ajout'),
    hrs = [],
    modifEnCours = false,
    exportasjson = document.getElementById('export'),
    importfromjson = document.getElementById('import'),
    idLienModif;

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

let downloadDatafile = (data_func, filename, mimetype) => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    const url = URL.createObjectURL(new Blob([ data_func() ], {type: mimetype || "text/plain"}));
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }, 0);
}

function ecrire_un_lien (id, nom, url, nouvel_onglet, classe){
    let div = document.createElement('div'),
        spansuppr = document.createElement('span'),
        textesuppr = document.createTextNode('🗑'),
        spanmodif = document.createElement('span'),
        textemodif = document.createTextNode('🖉'),
        lien = document.createElement('a'),
        textelien = document.createTextNode(nom);
    spanmodif.className = 'modifier';
    spanmodif.appendChild(textemodif);
    spanmodif.addEventListener('click', function(e){
        cancelButton.style.display = 'inline';
        deleteWhileModifyingButton.style.display = 'inline';
        buttonMontrer.style.display = 'none';
        divAjout.style.display = 'block';
        divAjout.scrollIntoView();
        modifEnCours = true;
        idLienModif = e.target.parentNode.id;
        document.getElementsByName('titre')[0].value = e.target.parentNode.lastChild.textContent;
        document.getElementsByName('url')[0].value = e.target.parentNode.lastChild.href;
        db.get(e.target.parentNode.id).then(function (doc){
            document.getElementsByName('classe')[0].value = doc['classe'];
        });
    });
    spansuppr.className = 'supprimer';
    spansuppr.appendChild(textesuppr);
    spansuppr.addEventListener('click', function(e){
        supprimer(e.target.parentNode.id);
    });
    lien.href = url;
    lien.appendChild(textelien);
    if (nouvel_onglet){
        lien.target = '_blank'
    }
    lien.addEventListener('mousedown', function(e){
        if (e.button == 1){
            e.preventDefault();
            window.open(e.target.href);
        }
    })
    div.id = id;
    div.classList.add('divlien', classe);
    div.appendChild(spanmodif);
    div.appendChild(spansuppr);
    div.appendChild(lien);
    divliens.insertBefore(div, document.getElementById(classe));
}

function supprimer (id){
    var confirmation = confirm('Êtes vous sûr de vouloir supprimer le lien "' + document.getElementById(id).lastChild.textContent + '" ?');
    if (confirmation){
        divliens.removeChild(document.getElementById(id));
        db.get(id).then(function (doc){
            db.remove(doc);
        });
        for (let i = 0; i<liens.length; i++){
            if (liens[i]['_id'] === id){
                liens.splice(i, 1);
            }
        }
    }
}
function modifier (id, titre, url, classe, onglet) {
    var lien = document.getElementById(id);
    db.get(id).then(function (doc){
        doc['nom'] = titre;
        doc['url'] = url;
        doc['classe'] = classe;
        doc['nouvel_onglet'] = onglet;
        return db.put(doc);
    });
    lien.lastChild.href = url;
    lien.lastChild.textContent = titre;
    if (onglet){
        lien.lastChild.target = '_blank';
    }
    if (lien.classList[1] != classe){
        let nouveau_lien = lien.cloneNode(true);
        divliens.insertBefore(nouveau_lien, document.getElementById(classe));
        divliens.removeChild(lien);
    }
    cancelButton.style.display = 'none';
    buttonMontrer.style.display = 'inline';
    divAjout.style.display = 'none';
    modifEnCours = false;
    document.getElementById('titre').value = '';
    document.getElementById('url').value = '';
    document.getElementById('classe').value = '';
    document.getElementById('onglet').checked = false;
}
function ecrire_les_liens(){
    document.body.removeChild(divliens);
    divliens = document.createElement('div');
    document.body.insertBefore(divliens, document.querySelector('#montrer'));
    divliens.id = "liens";
    hrs[hrs.length - 1].style.display = 'none';
    hrs.forEach(function (el){
        divliens.appendChild(el);
    });
    liens.forEach(function (lien){
        ecrire_un_lien(lien['_id'], lien['nom'], lien['url'], lien['nouvel_onglet'], lien['classe'])
    });
}

function enregistrer(){
    var titre = document.getElementById('titre').value,
        url = document.getElementById('url').value,
        classe = document.getElementById('classe').value.toLowerCase(),
        onglet = document.getElementById('onglet').checked,
        lien = {};
    lien['nom'] = titre;
    lien['url'] = url;
    lien['classe'] = classe;
    lien['nouvel_onglet'] = onglet;
    lien['_id'] = uuidv4();
    liens.push(lien);
    db.put(lien);
    document.getElementById('titre').value = '';
    document.getElementById('url').value = '';
    document.getElementById('classe').value = '';
    document.getElementById('onglet').checked = false;
    document.getElementById('ajout').style.display = 'none';
    buttonMontrer.textContent = '+';
    ecrire_les_liens();


}

entreeTitre.addEventListener('keyup', function (e) {
    if (e.key === 'Enter'){
        entreeUrl.focus()
    }
});

entreeUrl.addEventListener('keyup', function (e) {
    if (e.key === 'Enter'){
        entreeClasse.focus()
    }
});

entreeClasse.addEventListener('keyup', function (e) {
    if (e.key === 'Enter'){
        submitButton.focus()
    }
});

cancelButton.addEventListener('click', function (e){
    cancelButton.style.display = 'none';
    buttonMontrer.style.display = 'inline';
    divAjout.style.display = 'none';
    modifEnCours = false;
    document.getElementById('titre').value = '';
    document.getElementById('url').value = '';
    document.getElementById('classe').value = '';
    document.getElementById('onglet').checked = false;
});

deleteWhileModifyingButton.addEventListener('click', function (e){
    supprimer(idLienModif);
    cancelButton.style.display = 'none';
    buttonMontrer.style.display = 'inline';
    divAjout.style.display = 'none';
    modifEnCours = false;
    document.getElementById('titre').value = '';
    document.getElementById('url').value = '';
    document.getElementById('classe').value = '';
    document.getElementById('onglet').checked = false;
})

submitButton.addEventListener('click', function (){
    if (! modifEnCours){
        enregistrer();
    } else {
        modifier(idLienModif,
            document.getElementById('titre').value,
            document.getElementById('url').value,
            document.getElementById('classe').value,
            document.getElementById('onglet').checked);
    }
});

exportasjson.addEventListener('click', function (e) {
    downloadDatafile(() => JSON.stringify(liens), `liens-${(new Date()).toISOString()}.json`, 'application/json');
});

importfromjson.addEventListener('click', function (e) {
    function info (text) {
        let info = document.createElement('div');
        info.textContent = text;
        info.style = `
            position: absolute;
            top: 30px;
            text-align: center;
            width: 100%;
            background-color: #6eb1e180;
        `;
        document.body.appendChild(info)
        setTimeout(() => info.remove(), 10000);
    }
    let importfileinput = document.createElement('input');
    importfileinput.type = 'file';
    importfileinput.accept = 'application/json';
    importfileinput.style.visibility = 'hidden';
    importfileinput.addEventListener('change', function (e) {
        let file = importfileinput.files[0];
        if (file.type !== 'application/json') {
            info('Veuillez choisir un fichier JSON valide.');
        } else {
            let new_links;
            importfileinput.files[0].text().then((v) =>  {
                try {
                    new_links = JSON.parse(v);
                } catch {
                    info('Veuillez choisir un fichier JSON valide.');
                    return;
                }
                if (! Array.isArray(new_links)) {
                    info('Veuillez choisir un export JSON de cette page web.');
                } else {
                    new_links.forEach((link) => {
                        if (!(link.nom && link.url && link.classe && link.nouvel_onglet !== undefined && link._id)) {
                            info('Veuillez choisir un export JSON de cette page web.');
                            return;
                        } else {
                            if (! ids.includes(link._id)) {
                                link._id = uuidv4();
                                delete link._rev;
                                liens.push(link);
                                db.put(link);
                                ecrire_les_liens();
                            }
                        }
                    });
                }
            });
        }
        importfileinput.remove();
    });
    document.body.appendChild(importfileinput);
    importfileinput.click();
});

buttonMontrer.addEventListener('click', function(e){
    if (buttonMontrer.textContent === '+'){
        divAjout.style.display = 'block';
        divAjout.scrollIntoView();
        buttonMontrer.textContent = '-';
    } else {
        divAjout.style.display = 'none';
        buttonMontrer.textContent = '+';
    }
});

db.allDocs().then(function (docs){
    liens = docs.rows;
    numberRows = docs.total_rows;
    liens.forEach(function (lien){
        ids.push(lien.id);
    });
    liens = [];
    ids.forEach(function (id) { db.get(id).then(function (doc) {
        if (! classes.includes(doc['classe'])){
            classes.push(doc['classe']);
            let hr = document.createElement('hr');
            hr.id = doc['classe'];
            divliens.appendChild(hr);
            hrs.push(hr);
        }
        ecrire_un_lien(doc['_id'], doc['nom'], doc['url'], doc['nouvel_onglet'], doc['classe']);
        liens.push(doc);
        if (hrs.length > 1){
            hrs[hrs.length - 2].style.display = 'block';
        }
        hrs[hrs.length - 1].style.display = 'none';
    })});
});
