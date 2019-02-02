function print(s, klas) {
    var p = document.createElement('p');
    p.classList.add('message');
    if (!!klas){
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
                var geriou
                var enankou
                var ger
                var n_geriou_mat = 0;
                var enank = document.getElementById('enank');
                var holl_pe_nevez

                function ger_f(talvoud) {
                    if (talvoud.toLowerCase() === ger[1].toLowerCase()) {
                        n_geriou_mat = n_geriou_mat + 1;
                        print(talvoud, 'den');
                        print('Mat !', 'urzh');
                    } else {
                        print(talvoud, 'den');
                        print('Ket ! ' + ger[1] + ' eo.', "urzh");
                    }
                    ger = enankou[Math.floor(Math.random() * enankou.length)];
                    print(ger[0], 'urzh');
                }

                enank.addEventListener('keyup', e => {
                    if (e.key === 'Enter') {
                        if (typeof holl_pe_nevez === "undefined"){
                            holl_pe_nevez = enank.value === '1' ? 'holl' : 'nevez';
                            print(enank.value, 'den');
                            enank.value = '';
                            geriou = new Map(holl_pe_nevez === "holl" ? [...geriou_nevez, ...holl_geriou] : geriou_nevez);
                            enankou = Array.from(geriou.entries());
                            ger = enankou[Math.floor(Math.random() * enankou.length)];
                            print(ger[0], 'urzh'); //urzh evit urzhiataer
                        } else {
                            var talvoud = enank.value;
                            enank.value = '';
                            ger_f(talvoud);
                    };
                }});
});