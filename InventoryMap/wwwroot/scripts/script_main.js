

let firstPageContent = document.querySelector('.firstpage-content');



if (firstPageContent) {

    //console.log(document.body.scrollHeight);

    let firstPageHeight = parseFloat(window.innerHeight - 90);

    //console.log(firstPageHeight);

    firstPageContent.setAttribute('style', `height: ${firstPageHeight}px`);
}



let leftMenuContainer = document.querySelector('.jsLeftMenuContainer');

let leftMenuBtn = document.querySelector('.jsLeftMenuBtn');

let leftMenuBackIcon = document.querySelector('.left-menu-icon');


leftMenuBtn.addEventListener('click', function (e) {

    leftMenuContainer.classList.remove('hidden');

});

leftMenuBackIcon.addEventListener("click", function (e) {

    e.stopPropagation();

    leftMenuContainer.classList.add('hidden');

});


leftMenuContainer.addEventListener('click', function (e) {

    if (e.target == leftMenuContainer) {
        leftMenuContainer.classList.add('hidden');
    }

});

