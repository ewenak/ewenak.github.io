let geriou;
let enankou;
let ger;
let n_geriou_mat = 0;
let enank = document.getElementById('enank');
let holl_pe_nevez;
const authorized_chars = 'abcdefghijklmnopqrstuvwxyz ';

function print(s, klas) {
    var p = document.createElement('p');
    p.classList.add('message');
    if (!!klas) {
       p.classList.add(klas);
    }
    var span = document.createElement('span');
    span.textContent = s;
    p.appendChild(span);
    document.getElementById('montmaez').appendChild(p);
    enank.scrollIntoView();
}

print("C'hoant peus deskiñ 1) an holl gerioù pe 2) nemet ar re nevez ?", 'urzh');

function get_data(url) {
    return fetch(url).then(r => r.text().then(geriou => 
        new Map(geriou.split('\n').filter(s => s.includes(':')).map(s => s.split(': ')))));
}

Promise.all( [ get_data('geriou_nevez.txt'),
               get_data('holl_geriou.txt') ]).then( ([geriou_nevez, holl_geriou]) => {
    function ger_f(talvoud) {
        let respontet = Array.from(talvoud.toLowerCase()).filter(c => authorized_chars.includes(c)).join('');
        let respont = Array.from(ger[1].toLowerCase()).filter(c => authorized_chars.includes(c)).join('');
        if (respontet === respont) {
            n_geriou_mat = n_geriou_mat + 1;
            print(talvoud, 'den');
            print('Mat !', 'urzh');
        } else {
            print(talvoud, 'den');
            print('Ket ! ' + ger[1] + ' eo.', "urzh");
        }
        if (enankou.length > 0) {
            ger = enankou.pop();
        } else {
            geriou = new Map(holl_pe_nevez === "holl" ? [...geriou_nevez, ...holl_geriou] : geriou_nevez);
            enankou = Array.from(geriou.entries());
            for(let i = enankou.length - 1; i > 0; i--){
                const j = Math.floor(Math.random() * i);
                const temp = enankou[i];
                enankou[i] = enankou[j];
                enankou[j] = temp;
            }
            ger = enankou.pop();
        }
        print(ger[0], 'urzh');
    }

    enank.addEventListener('keyup', e => {
        if (e.key === 'Enter') {
            if (typeof holl_pe_nevez === "undefined"){
                print(enank.value, 'den');
                switch (enank.value) {
                    case '1':
                        holl_pe_nevez = 'holl';
                        break
                    case '2':
                        holl_pe_nevez = 'nevez';
                        break
                    default:
                        print('Skrivit 1 pe 2', 'urzh');
                        print("C'hoant peus deskiñ 1) an holl gerioù pe 2) nemet ar re nevez ?", 'urzh');
                        enank.value = '';
                        return;
                }
                enank.value = '';
                geriou = new Map(holl_pe_nevez === "holl" ? [...geriou_nevez, ...holl_geriou] : geriou_nevez);
                enankou = Array.from(geriou.entries());
                for (let i = enankou.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * i);
                    const temp = enankou[i];
                    enankou[i] = enankou[j];
                    enankou[j] = temp;
                }
                ger = enankou.pop();
                print(ger[0], 'urzh'); //urzh evit urzhiataer
            } else {
                var talvoud = enank.value;
                enank.value = '';
                ger_f(talvoud);
        };
    }});
});
