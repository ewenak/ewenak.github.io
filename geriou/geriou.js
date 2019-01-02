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

fetch('holl_geriou.txt').then(r => r.text().then(geriou => {
    geriou = new Map(geriou.split('\n').filter(s => s.includes(':')).map(s => s.split(': ')));
    var n_geriou_mat = 0;
    var enank = document.getElementById('enank');
    var enankou = Array.from(geriou.entries());
    var ger = enankou[Math.floor(Math.random() * enankou.length)];
    print(ger[0], 'urzh'); //urzh evit urzhiataer

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
            var talvoud = enank.value;
            enank.value = '';
            ger_f(talvoud);
        };
    });
})
);