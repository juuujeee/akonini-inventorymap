const RegExpDataValidationPatterns = {
    EmailAddress: /^([a-z\d\.-_]+)@([a-z\d-]+).([a-z]{2,8})(\.[a-z]{2,8})$/,
    IStillLoveYou: /^([\w@-]{8,20})$/,
    ConfirmPassword: /^([\w@-]{8,20})$/,
    FirstName: /^([a-zA-Z\s]+)$/,
    LastName: /^([a-zA-Z\s]+)$/,
    CompanyName: /^(?:\s*[a-zA-Z0-9,_\.\077\0100\*\+\&\#\'\~\;\-\!\@\;]{2,}\s*)*$/,
    MobileNo: /^(\+?\(?)([0-9\)-]{6,20})$/,
    LandlineNo: /^(\+?\(?)([0-9\)-]{6,20})$/,
    Latitude: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/,
    Longitude: /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/,
    ProjectName: /^(?:\s*[a-zA-Z0-9,_\.\077\0100\*\+\&\#\'\~\;\-\!\@\;]{1,}\s*)*$/,
    ProjectPhase: /^(?:\s*[a-zA-Z0-9,_\.\077\0100\*\+\&\#\'\~\;\-\!\@\;]{1,}\s*)*$/,
    ProjectBlock: /^(?:\s*[a-zA-Z0-9,_\.\077\0100\*\+\&\#\'\~\;\-\!\@\;]{1,}\s*)*$/,
    ProjectLotNo: /^(\d{1,10})$/, // number w/o decimal
    ProjectLotArea: /^\d+(\.\d{1,2})?$/, //number with optional decimal
    newModelSpecsModelName: /^([a-zA-Z\s\d-_]+)$/,
    NewModelSpecsFloorArea: /^\d+(\.\d{1,2})?$/, //number with optional decimal
    Quantity: /^\d+(\.\d{1,2})?$/, //number with optional decimal,
    FormattedMobileNo: /^(09)\d{9}$/,
    strongPassword: /^(?=.*\d)(?=.*[!@#$%^&*?+-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    isImage: /.(jpg|jpeg|png)$/i,
    chatAcceptedFileType: /.(jpg|jpeg|png|pdf|docx|pptx|xlsx)$/i,
    isValidPRCNumber: /^[0-9]{7,7}$/
}

const globalFuncObj = {
    fetchDataGet: async function (url) {

        let retData;

        let options = {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            }
        }
        await fetch(url, options).then(res => {
            if (res.ok) {
                return res.json()
            }
            else if (res.status == 440) {
                throw alertMessages.sessionExpired
            }
            else if (res.status == 409) {
                throw alertMessages.throttleError;
            }
            else {
                throw alertMessages.serverError
            }
        }).then(data => {
            retData = data;
        }).catch(error => {

            if (error != alertMessages.throttleError) {
                globalFuncObj.isConfirmedAlertOk(alertType.errorAlert, error);
            }

            // globalFuncObj.isConfirmedAlertOk(alertType.errorAlert, error);
        })

        return retData;
    },

    fetchDataPost: async function (url, formData) {

        formData.append("__RequestVerificationToken", document.querySelector("input[name=__RequestVerificationToken").value);

        let retData;

        let options = {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            },
            method: 'POST',
            body: formData
        }
        await fetch(url, options).then(res => {
            if (res.ok) {
                return res.json()
            }
            else if (res.status == 440) {
                throw alertMessages.sessionExpired
            }
            else {
                throw alertMessages.serverError
            }
        }).then(data => {

            retData = data;

        }).catch(error => {

            console.log(error);

            globalFuncObj.isConfirmedAlertOk(alertType.errorAlert, error);
        })

        return retData;
    },

    fetchView: async function (url) {
        let retView;

        let options = {
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        }
        await fetch(url, options).then(res => {
            if (res.ok) {
                return res.text()
            }
            else if (res.status == 440) {
                throw alertMessages.sessionExpired
            }
            else if (res.status == 409) {
                throw alertMessages.throttleError;
            }
            else {
                throw alertMessages.serverError
            }
        }).then(view => {
            retView = view;
        }).catch(error => {

            console.log(error);

            if (error != alertMessages.throttleError) {
                globalFuncObj.isConfirmedAlertOk(alertType.errorAlert, error);
            }

        })

        return retView;
    },

    fetchUploadFile: async function (url, formData) {

        let retData;

        let options = {
            method: 'POST',
            body: formData
        }
        await fetch(url, options).then(res => {
            if (res.ok) {
                return res.json()
            }
            else if (res.status == 440) {
                throw alertMessages.sessionExpired
            }
            else {
                throw alertMessages.serverError
            }
        }).then(data => {

            retData = data;

        }).catch(error => {

            if (!document.querySelector('.jsAlertOkMainCont')) {
                globalFuncObj.isConfirmedAlertOk(alertType.errorAlert, error);

            }

        })

        return retData;
    },

    isConfirmedAlertOk: function (alertObj, alertMessage) {
        // main container, transparent background
        const containerDiv = document.createElement('div');
        containerDiv.classList.add('alert-main-expandable-cont', 'jsAlertOkMainCont');

        // alert container
        const div0 = document.createElement('div');
        div0.classList.add('alert-cont-00');

        // alert header
        const alertHeader = document.createElement('div');
        alertHeader.classList.add('alert-cont-01', 'alert-cont-header', `${alertObj.colorClassName}`);


        // icon img
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('alert-icon-cont');

        const iconImage = document.createElement('img');
        iconImage.classList.add(alertObj.iconImageClassName);
        iconImage.src = alertObj.imageSrc;

        imgDiv.appendChild(iconImage);

        // label
        const headerLabel = document.createElement('label')
        headerLabel.classList.add('alert-header-label')
        headerLabel.textContent = alertObj.headerText

        // append
        alertHeader.appendChild(imgDiv);
        alertHeader.appendChild(headerLabel);
        div0.appendChild(alertHeader);


        // alert content
        const alertContent = document.createElement('div');
        alertContent.classList.add('alert-cont-01', 'alert-cont-content');

        // alert paragraph
        const alertContentParag = document.createElement('p');
        alertContentParag.classList.add('alert-paragraph')
        alertContentParag.innerHTML = alertMessage

        alertContent.appendChild(alertContentParag)
        div0.appendChild(alertContent);

        // alert footer
        const alertFooter = document.createElement('div');
        alertFooter.classList.add('alert-cont-01', 'alert-cont-footer');

        // alert button ok
        const alertFooterBtnOk = document.createElement('button');
        alertFooterBtnOk.classList.add('alert-button', 'alert-button-ok', 'jsAlertButtonOkProjectPhase');
        alertFooterBtnOk.innerText = 'Ok';

        // event listener for OK
        alertFooterBtnOk.addEventListener('click', function () {

            containerDiv.remove();

            if (alertMessage == alertMessages.sessionExpired) {

                //window.location.href = AppGlobal.baseUrl + "/user/login/?moduleID=" + parseInt(AppGlobal.moduleID)

                if (location.pathname.contains('seller')) {
                    window.location.href = AppGlobal.baseUrl + 'home/index';
                }

                else if (location.pathname.contains('developer')) {
                    window.location.href = AppGlobal.baseUrl + 'home';
                }

            }
        });


        alertFooter.appendChild(alertFooterBtnOk)

        div0.appendChild(alertFooter);

        containerDiv.appendChild(div0);
        document.body.appendChild(containerDiv);
    },

    isConfirmedAlertYesOrNo: function (alertObj, alertMessage) {

        // main container, transparent background
        const containerDiv = document.createElement('div');
        containerDiv.classList.add('alert-main-expandable-cont', 'jsAlertOkMainCont');

        // alert container
        const div0 = document.createElement('div');
        div0.classList.add('alert-cont-00');

        // alert header
        const alertHeader = document.createElement('div');
        alertHeader.classList.add('alert-cont-01', 'alert-cont-header', `${alertObj.colorClassName}`);


        // icon img
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('alert-icon-cont');

        const iconImage = document.createElement('img');
        iconImage.classList.add(alertObj.iconImageClassName)
        iconImage.src = alertObj.imageSrc;

        imgDiv.appendChild(iconImage);

        // label
        const headerLabel = document.createElement('label')
        headerLabel.classList.add('alert-header-label')
        headerLabel.textContent = alertObj.headerText

        // append
        alertHeader.appendChild(imgDiv);
        alertHeader.appendChild(headerLabel);
        div0.appendChild(alertHeader);


        // alert content
        const alertContent = document.createElement('div');
        alertContent.classList.add('alert-cont-01', 'alert-cont-content');

        // alert paragraph
        const alertContentParag = document.createElement('p');
        alertContentParag.classList.add('alert-paragraph')
        alertContentParag.innerText = alertMessage

        alertContent.appendChild(alertContentParag)
        div0.appendChild(alertContent);

        // alert footer
        const alertFooter = document.createElement('div');
        alertFooter.classList.add('alert-cont-01', 'alert-cont-footer');

        // alert button no
        const alertFooterBtnNo = document.createElement('button');
        alertFooterBtnNo.classList.add('alert-button', 'alert-button-no', 'jsProjectDeleteItemNo');
        alertFooterBtnNo.innerText = 'No';

        alertFooter.appendChild(alertFooterBtnNo)

        // alert button yes
        const alertFooterBtnYes = document.createElement('button');
        alertFooterBtnYes.classList.add('alert-button', 'alert-button-yes', 'jsProjectDeleteItemYes');
        alertFooterBtnYes.innerText = 'Yes';

        alertFooter.appendChild(alertFooterBtnNo)
        alertFooter.appendChild(alertFooterBtnYes)

        div0.appendChild(alertFooter);

        containerDiv.appendChild(div0);
        document.body.appendChild(containerDiv);

        return new Promise(function (resolve, reject) {
            alertFooterBtnYes.addEventListener('click', function () {
                resolve('Yes');
                containerDiv.remove();
            })

            alertFooterBtnNo.addEventListener('click', function () {
                reject('No');
                containerDiv.remove();
            })
        })
    },

    getCookie: function (cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },

    isValidUrl: function (urlString) {
        try {
            return new URL(urlString);
        }
        catch {
            return false;
        }
    },

    processFileToCanvas: async function (config, callback) {

        let reader = new FileReader();
        let imageEl = new Image();

        reader.onload = function () {

            var dataURL = reader.result;
            imageEl.src = dataURL;

            imageEl.onload = async function () {

                let webImgFile, mobileImgFile;
                // let commonFileName = config.imagePrefixName + new Date().getTime();
                let commonFileName = config.input.files[0].name;

                let canvas = document.createElement('CANVAS');
                let ctx = canvas.getContext('2d');

                let imgWidth = this.width;
                let imgHeight = this.height;

                let ratioX = config.width / imgWidth;
                let ratioY = config.height / imgHeight;
                let ratio = Math.min(ratioX, ratioY);

                let newWidth = parseInt(this.width * ratio);
                let newHeight = parseInt(this.height * ratio);

                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.drawImage(this, 0, 0, newWidth, newHeight);

                webImgFile = await new Promise((resolve, reject) => {

                    canvas.toBlob(function (blob) {

                        resolve(new File([blob], `${commonFileName}`, { type: 'image/jpg' }));

                    }, 'image/jpeg', 0.7);

                });


                let canvasMobile = document.createElement('CANVAS');
                let ctx2 = canvasMobile.getContext('2d');

                let imgWidth2 = this.width;
                let imgHeight2 = this.height;

                let ratioX2 = config.width / imgWidth2;
                let ratioY2 = config.height / imgHeight2;
                let ratio2 = Math.min(ratioX2, ratioY2);

                let newWidth2 = parseInt((this.width - (this.width * .43)) * ratio2);
                let newHeight2 = parseInt((this.height - (this.height * .56)) * ratio2);

                canvasMobile.width = newWidth2;
                canvasMobile.height = newHeight2;

                ctx2.drawImage(this, 0, 0, newWidth2, newHeight2);

                mobileImgFile = await new Promise((resolve, reject) => {

                    canvasMobile.toBlob(function (blob) {

                        resolve(new File([blob], `${commonFileName}`, { type: 'image/jpg' }));

                    }, 'image/jpeg', 0.7);
                });

                callback(webImgFile, mobileImgFile);
            }
        };

        reader.readAsDataURL(config.input.files[0]);
    },

    isNumber: function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    },

    loader: {
        start: function () {

            let preloader = globalFuncObj.preloaderDivClone();

            if (!document.querySelector('.preloader')) {
                document.body.append(preloader);

            }

        },
        stop: function () {

            if (document.body.querySelector('.preloader')) {
                document.querySelector('.preloader').remove();
            }

        }
    },

    preloaderDivClone: function () {
        let div = `<div class="preloader spinner"></div>`;

        return new DOMParser().parseFromString(div, 'text/html').querySelector('.preloader');
    },

    loadDataList: function (listData, targetProperty) {
        if (listData.length < 10) {

            let linkList = new LinkedList()
            listData.forEach((item) => {
                linkList.push(item);
            });

            return linkList;
        }
        let BST = new BinarySearchTree();
        let leftArrayOfObjID = [];
        let root = Math.floor(listData.length / 2);
        let leftTempUpperValue = root;
        let leftTempLowerValue = 0;
        let leftTempIndex = Math.floor(leftTempUpperValue - (leftTempUpperValue - leftTempLowerValue) / 2);

        BST.insert(listData[root], targetProperty);
        BST.insert(listData[leftTempIndex], targetProperty);


        leftArrayOfObjID.push(leftTempLowerValue);
        leftArrayOfObjID.push(leftTempIndex);
        leftArrayOfObjID.push(leftTempUpperValue);

        let isIterable = true
        while (isIterable) {
            isIterable = false
            let upperIndex = leftArrayOfObjID.length - 1
            let newArrayNode
            for (let i = upperIndex; i > 0; i = upperIndex) {
                if ((leftArrayOfObjID[i] - leftArrayOfObjID[i - 1]) !== 1) {
                    newArrayNode = Math.floor((leftArrayOfObjID[i] - leftArrayOfObjID[i - 1]) / 2) + leftArrayOfObjID[i - 1]
                    BST.insert(listData[newArrayNode], targetProperty)
                    leftArrayOfObjID.splice((i), 0, newArrayNode)
                    isIterable = true;
                }
                upperIndex = upperIndex - 1
            }
        }
        BST.insert(listData[leftTempLowerValue], targetProperty);


        let rightArrayOfObjID = [];
        let rightTempUpperValue = listData.length - 1;
        let rightTempLowerValue = root;
        let rightTempIndex = Math.floor(rightTempUpperValue - (rightTempUpperValue - rightTempLowerValue) / 2);

        BST.insert(listData[rightTempIndex], targetProperty);

        rightArrayOfObjID.push(rightTempLowerValue);
        rightArrayOfObjID.push(rightTempIndex);
        rightArrayOfObjID.push(rightTempUpperValue);

        isIterable = true
        while (isIterable) {
            isIterable = false
            let upperIndex = rightArrayOfObjID.length - 1
            let newArrayNode
            for (let i = upperIndex; i > 0; i = upperIndex) {
                if ((rightArrayOfObjID[i] - rightArrayOfObjID[i - 1]) !== 1) {
                    newArrayNode = Math.floor((rightArrayOfObjID[i] - rightArrayOfObjID[i - 1]) / 2) + rightArrayOfObjID[i - 1]
                    BST.insert(listData[newArrayNode], targetProperty)
                    rightArrayOfObjID.splice((i), 0, newArrayNode)
                    isIterable = true;
                }
                upperIndex = upperIndex - 1
            }
        }
        BST.insert(listData[rightTempUpperValue], targetProperty);

        return BST
    },

    chatFileOpenModal: function (el) {

        el.addEventListener('click', function (e) {

            let elem = e.currentTarget;

            let tagName = elem.tagName;
            let fileName = elem.getAttribute('data-fileName');
            let encodedFileName = elem.getAttribute('data-encodedFileName');

            let dataHref;
            let fileType;


            switch (tagName) {
                case 'SPAN':
                    dataHref = elem.getAttribute('data-href');
                    fileType = 'file';

                    break;

                case 'IMG':
                    dataHref = elem.getAttribute('src');
                    fileType = 'image';

                    break;
            }

            let config = {
                fileName: fileName,
                dataHref: dataHref,
                fileType: fileType,
                encodedFileName: encodedFileName
            };

            launchModal(config);

        });


        function launchModal(config) {

            let customCss = "width: 700px; left: calc(100% - 50% - calc(700px / 2))";

            if (window.screen.width <= 767) {
                customCss = "width: calc(100% - 20px); left: calc(100% - 50% - calc(calc(100% - 20px) / 2)); top: 50%; transform: translateY(-50%)";
            }

            let div = `
                <div class="modal-container">
                <div class="modal-content" style="${customCss}">
                    <div class="modal-header">
                        <h3>Attachment</h3>
                        <span class="close-modal">&#10006</span>
                    </div>
                    <div class="modal-body">
                        
                    </div>
                    <div class="modal-footer" style="text-align: right; height: auto; margin: 15px 0">
                        <a target="_blank" href="${AppGlobal.filePath}download/${config.encodedFileName}" class="chat-files-downloadBtn jsDownloadBtn" download="${config.fileName}">Download</a>
                    </div>
                </div>
            </div>
            `;

            let modalContainer = new DOMParser().parseFromString(div, 'text/html').querySelector('.modal-container');

            if (config.fileType == 'image') {
                let img = document.createElement('img')
                img.src = config.dataHref;
                img.setAttribute('style', 'display: block; margin-left: auto; margin-right: auto; width: 100%;');

                modalContainer.querySelector('.modal-body').appendChild(img);
            }
            else {
                let p = document.createElement('p');
                p.textContent = "Can't preview file";
                p.setAttribute('style', 'margin: 15px 0;');

                modalContainer.querySelector('.modal-body').appendChild(p);
            }


            modalContainer.querySelector('.close-modal').addEventListener('click', function (e) {
                modalContainer.remove();
            });


            document.body.appendChild(modalContainer);
        }
    },

    toJavascriptDate: function (value) {
        if (value === null || value === 'undefined' || value === 'null') {
            return false;
        }
        var results = value.match(/\d+/);
        var dt = new Date(parseFloat(results[0]));
        //return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
        var getMonth = ((dt.getMonth() + 1) < 10 ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1));
        var getDate = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();

        return dt.getFullYear() + "-" + getMonth + "-" + getDate;
    },

    IsConfirmedAlertOkReturn: function (alertObj, alertMessage) {

        // main container, transparent background
        const containerDiv = document.createElement('div');
        containerDiv.classList.add('alert-main-expandable-cont', 'jsAlertOkMainCont');

        // alert container
        const div0 = document.createElement('div');
        div0.classList.add('alert-cont-00');

        // alert header
        const alertHeader = document.createElement('div');
        alertHeader.classList.add('alert-cont-01', 'alert-cont-header', `${alertObj.colorClassName}`);


        // icon img
        const imgDiv = document.createElement('div');
        imgDiv.classList.add('alert-icon-cont');

        const iconImage = document.createElement('img');
        iconImage.classList.add(alertObj.iconImageClassName)
        iconImage.src = alertObj.imageSrc;

        imgDiv.appendChild(iconImage);

        // label
        const headerLabel = document.createElement('label')
        headerLabel.classList.add('alert-header-label')
        headerLabel.textContent = alertObj.headerText

        // append
        alertHeader.appendChild(imgDiv);
        alertHeader.appendChild(headerLabel);
        div0.appendChild(alertHeader);


        // alert content
        const alertContent = document.createElement('div');
        alertContent.classList.add('alert-cont-01', 'alert-cont-content');

        // alert paragraph
        const alertContentParag = document.createElement('p');
        alertContentParag.classList.add('alert-paragraph')
        alertContentParag.innerText = alertMessage

        alertContent.appendChild(alertContentParag)
        div0.appendChild(alertContent);

        // alert footer
        const alertFooter = document.createElement('div');
        alertFooter.classList.add('alert-cont-01', 'alert-cont-footer');

        // alert button ok
        const alertFooterBtnOk = document.createElement('button');
        alertFooterBtnOk.classList.add('alert-button', 'alert-button-ok', 'jsAlertButtonOkProjectPhase');
        alertFooterBtnOk.innerText = 'Ok';

        //// event listener for OK
        //alertFooterBtnOk.addEventListener('click', function () {
        //    containerDiv.remove();

        //    if (alertMessage == alertMessages.sessionExpired) {
        //        window.location.reload()
        //    }
        //});


        alertFooter.appendChild(alertFooterBtnOk)

        div0.appendChild(alertFooter);

        containerDiv.appendChild(div0);
        document.body.appendChild(containerDiv);

        return new Promise(function (resolve, reject) {
            alertFooterBtnOk.addEventListener('click', function () {

                window.location.href = AppGlobal.baseUrl + 'user/login/';
            })

        })
    },

    numberWithCommas: function (value) {

        try {

            let cleanNum = globalFuncObj.removeCommas(value.toString());

            //console.log(cleanNum);

            let convertedNum = cleanNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            return convertedNum;
        }
        catch (ex) {
            console.log(ex);
        }
    },

    removeCommas: function (str) {
        while (str.search(",") >= 0) {
            str = (str + "").replace(',', '');
        }
        return str;
    },

    toJavascriptDateTime: function (value) {
        if (value === null || value === 'undefined' || value === 'null') {
            return false;
        }
        var results = value.match(/\d+/);
        var dt = new Date(parseFloat(results[0]));
        //return (dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear();
        var getMonth = ((dt.getMonth() + 1) < 10 ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1));
        var getDate = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();

        var getTime = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
        return dt.getFullYear() + "-" + getMonth + "-" + getDate + " " + getTime;
    },

    timeAgo: function (date) {
        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = seconds / 31536000;

        if (interval > 1) {
            return Math.floor(interval) > 1 ? Math.floor(interval) + " years ago" : Math.floor(interval) + " year ago";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) > 1 ? Math.floor(interval) + " months ago" : Math.floor(interval) + " month ago";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) > 1 ? Math.floor(interval) + " days ago" : Math.floor(interval) + " day ago";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) > 1 ? Math.floor(interval) + " hours ago" : Math.floor(interval) + " hour ago";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) > 1 ? Math.floor(interval) + " minutes ago" : Math.floor(interval) + " minute ago";
        }

        return "just now";
    },

    formatDateTime: function (date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return (date.toLocaleString('default', { month: 'short' })) + " " + date.getDate() + ", " + date.getFullYear() + "  " + strTime;
    },

    dataURItoFile: async function (dataURI, fileName, fileType) {

        let msgFile = await fetch(dataURI);

        let msgFileBlob = await msgFile.blob();

        return new File([msgFileBlob], fileName, { type: fileType });

    },

    setActiveMenu: function (menuItem) {

        document.querySelectorAll('.left-panel-menu-item').forEach((item) => {
            item.classList.remove('active');
        });

        menuItem.classList.add('active');

    },

    removeSpecialCharacters: function (str) {

        return str.replace(/[^\w\s]/gi, '').replaceAll(" ", "-").toLowerCase();
    },

    dropdownFunc: function (input, config, callback) {
        let rawData = config.rawData;
        let dataToDisplay = config.dataToDisplay;
        let dataID = config.dataID;

        let activeLi = null;
        let parentEl = input.closest('.hasDropdown');

        //INPUT EVENT
        input.addEventListener('input', function (e) {
            let searchResults;
            let val = e.target.value;

            if (val) {
                if (config.dataToSearch) {
                    searchResults = rawData.indexOf(config.dataToSearch, val);

                }
                else {
                    searchResults = rawData.indexOf(config.dataToDisplay, val);

                }

            }
            else {
                input.removeAttribute('data-id');
                input.removeAttribute('data-textcontent');
            }

            if (searchResults && searchResults.length > 0) {
                searchResults.sort(function (a, b) {

                    if (a[dataToDisplay].toLowerCase() < b[dataToDisplay].toLowerCase()) {
                        return -1;
                    }
                    if (a[dataToDisplay].toLowerCase() > b[dataToDisplay].toLowerCase()) {
                        return 1;
                    }
                    return 0;
                });
            }

            displayULItems(searchResults);
        });

        //KEYDOWN EVENT
        input.addEventListener('keydown', function (e) {

            let ul = parentEl.querySelector('ul');

            if (ul && ul.children.length > 0) {

                e.stopPropagation();

                switch (e.which) {

                    //ARROW UP KEY
                    case 38:

                        if (activeLi) {
                            if (activeLi.previousElementSibling) {
                                //remove the class of current li
                                activeLi.classList.remove('active');

                                //change the active li into previous sibling
                                activeLi = activeLi.previousElementSibling;

                                //set class of new active li element
                                activeLi.classList.add('active');

                                //activeLi.scrollIntoView();
                            }
                        }
                        else {
                            activeLi = ul.children[ul.children.length - 1];
                            activeLi.classList.add('active');
                        }
                        break;


                    //ARROW DOWN KEY
                    case 40:

                        if (activeLi) {
                            if (activeLi.nextElementSibling) {
                                //remove the class of current li
                                activeLi.classList.remove('active');

                                //change the active li into next sibling
                                activeLi = activeLi.nextElementSibling;

                                //set class of new active li element
                                activeLi.classList.add('active');

                                //activeLi.scrollIntoView();
                            }
                        }
                        else {

                            activeLi = ul.children[0];
                            activeLi.classList.add('active');
                        }

                        break;


                    //ENTER KEY
                    case 13:
                        if (activeLi) {
                            activeLi.click();
                        }
                        break;


                    //escape key
                    case 27:
                        if (ul) {
                            ul.remove();
                        }
                        if (input.getAttribute('data-textcontent')) {
                            input.value = input.getAttribute('data-textcontent');
                        }
                        break;


                    //tab key
                    case 9:
                        if (ul && activeLi) {
                            activeLi.click();
                        }

                        break;
                }
            }
            else {
                activeLi = null;
            }

        });

        //CLICK EVENT
        let inputNextElement = input.nextElementSibling;

        if (inputNextElement) {
            inputNextElement.addEventListener('click', function (e) {

                //console.log('click here');

                let searchResults;

                if (e.currentTarget.classList.contains('clicked')) {

                    e.currentTarget.classList.remove('clicked');

                    if (parentEl.querySelector('ul')) {
                        parentEl.querySelector('ul').remove();
                    }

                    return;
                }

                e.currentTarget.classList.add('clicked');

                //let name = input.getAttribute('name');

                searchResults = rawData.getAll();

                if (searchResults && searchResults.length > 0) {
                    searchResults.sort(function (a, b) {

                        if (a[dataToDisplay].toLowerCase() < b[dataToDisplay].toLowerCase()) {
                            return -1;
                        }
                        if (a[dataToDisplay].toLowerCase() > b[dataToDisplay].toLowerCase()) {
                            return 1;
                        }
                        return 0;
                    });
                }

                displayULItems(searchResults);

            });
        }

        function displayULItems(data) {

            if (parentEl.querySelector('ul')) {
                parentEl.querySelector('ul').remove();
            }

            let ul = document.createElement('ul');

            if (data) {

                if (data.length > 0) {

                    //get the parentEl

                    ul.className = 'dropdownUL custom-scrollbar';

                    for (var i = 0; i < data.length; i++) {

                        let li = document.createElement('li');
                        li.className = 'dropdownLI';

                        li.setAttribute('data-id', data[i][dataID]);
                        li.textContent = data[i][dataToDisplay];

                        if (config.dataDisplayLabel) {
                            let small = document.createElement('small');
                            small.textContent = `(${data[i][config.dataDisplayLabel]})`;

                            li.appendChild(small);
                        }

                        if (i == 0) {
                            activeLi = li;
                            activeLi.classList.add('active');
                        }

                        //console.log(data[i]);

                        let returnData = data[i];

                        li.addEventListener('click', function (e) {

                            callback(returnData);

                            input.value = returnData[dataToDisplay];
                            input.setAttribute('data-id', returnData[dataID]);
                            input.setAttribute('data-textContent', returnData[dataToDisplay]);
                            input.nextElementSibling.classList.remove("clicked");

                            //remove the ul
                            ul.remove();

                        });

                        li.addEventListener('mouseenter', function (e) {

                            e.stopPropagation();

                            if (activeLi) {
                                activeLi.classList.remove('active');
                            }

                            e.target.classList.add('active');
                            activeLi = e.target;
                        });

                        ul.appendChild(li);
                    }

                    parentEl.appendChild(ul);

                }
            }
        }
    },

    getCurrentUrl: function () {
        return window.location.href;
    },

    mobileMenuActiveEl: null,

    setActiveMobileMenu: function (menuBtn) {

        if (globalFuncObj.mobileMenuActiveEl) {
            //globalFuncObj.mobileMenuActiveEl.querySelector('svg').setAttribute('style', 'fill: #999');

            globalFuncObj.mobileMenuActiveEl.classList.remove('active');
        }
        
        menuBtn.classList.add('active');

        globalFuncObj.mobileMenuActiveEl = menuBtn;
    },

    collapsedExpand: function (iconArrow, containerCollaps)
    {
        iconArrow.addEventListener('click', function () {

            console.log(containerCollaps);


            if (parseInt(AppGlobal.masterPersonID) == 0 || isNaN(parseInt(AppGlobal.masterPersonID))) {

                if (iconArrow.classList.contains("jsPriceComputation") || iconArrow.classList.contains("jsLocationMap") || iconArrow.classList.contains("jsInventoryMap") || iconArrow.classList.contains("jsGMapLink"))
                {

                    let hasImage = containerCollaps.querySelector(".jsProjectImagesItem");

                    if (hasImage) {


                        let loginUrl = AppGlobal.baseUrl + "user/login?returnUrl=" + window.location.href;

                        let signupUrl = AppGlobal.baseUrl + "user/register";

                        let alerMessage = `<a href="${loginUrl}">Login</a>&nbsp;or&nbsp;<a href="${signupUrl}">Register</a>&nbsp; to view this content.`;

                        globalFuncObj.isConfirmedAlertOk(alertType.warningAlert, alerMessage);

                        return;
                    }
                    
                }

            }

            iconArrow.querySelector('i').classList.toggle('rotate-360');
            if (containerCollaps) {
                containerCollaps.classList.toggle('collapsed');
            }
           
        });
    }

}

const notifSocketObj = {
    ws: null,
    init: function () {
        this.ws = new WebSocket(`wss://akonini-notifserver.azurewebsites.net/${AppGlobal.masterPersonID}`)
        this.ws.onopen = function () {

            // console.log('OK');
        }
        this.ws.onclose = function () {
            setTimeout((function () {
                notifSocketObj.init();
            }), 5000);
        }
        this.ws.onmessage = function (evt) {

            let notifData = JSON.parse(evt.data);
            let homePage = document.querySelector('.homepage-wrapper');

            if (notifData.type && notifData.type == 'messageRequest') {

                let chatDiv = document.querySelector('.jsChatContainer');

                let newChatSenderListItemObj = {
                    ChatID: notifData.ChatID,
                    DateCreated: globalFuncObj.formatDateTime(new Date()),
                    IsActive: false,
                    IsAttachment: false,
                    IsDeleted: false,
                    IsRead: true,
                    LastMessage: notifData.LastMessage,
                    ProjectAndModel: '',
                    Name: notifData.BuyerName,
                    UserID: notifData.fromUserID
                };

                if (chatDiv) {

                    if (chatGlobalObj.chatSenderList.length > 0) {

                        let conversationItem = chatGlobalObj.chatSenderList.find(x => x.ChatMainID === notifData.ChatMainID);

                        if (conversationItem) {

                            let index = chatGlobalObj.chatSenderList.indexOf(conversationItem);

                            let conversationItemClone = conversationItem;

                            chatGlobalObj.chatSenderList.splice(index, 1);

                            chatGlobalObj.chatSenderList.unshift(conversationItemClone);

                            chatGlobalObj.displayChatConversationNames(chatDiv);

                        }

                    }

                    //connect to chat websocket
                    let jsonObj = {
                        userID: AppGlobal.masterPersonID,
                        msg: 'iungerelocus',
                        room: notifData.ChatMainID
                    };

                    if (chatSocketObj.ws) {
                        chatSocketObj.send(JSON.stringify(jsonObj));
                    }
                    else {
                        let chatData = [];

                        jsonObj.ChatMainID = notifData.ChatMainID;

                        chatData.push(jsonObj);

                        chatSocketObj.init(chatData);
                    }

                }
                else {

                    if (chatGlobalObj.chatSenderList.length > 0) {

                        chatGlobalObj.chatSenderList.unshift(newChatSenderListItemObj);
                    }
                    else {
                        chatGlobalObj.chatSenderList.push(newChatSenderListItemObj);
                    }


                    //auto join room / connect to chat websocket
                    let jsonObj = {
                        userID: AppGlobal.masterPersonID,
                        msg: 'iungerelocus',
                        room: notifData.ChatMainID
                    };

                    if (chatSocketObj.ws) {
                        chatSocketObj.send(JSON.stringify(jsonObj));
                    }
                    else {
                        let chatData = [];

                        jsonObj.ChatMainID = notifData.ChatMainID;

                        chatData.push(jsonObj);

                        chatSocketObj.init(chatData);

                    }

                    //notify the message tab
                    let counterMessage = document.querySelector('.jsChatMessageCounter');

                    if (counterMessage.classList.contains('hide-items')) {
                        counterMessage.classList.remove('hide-items');
                    }
                }
            }

            else {
                //for home
                if (homePage) {

                    let notifWrapper = document.querySelector('.main-notification-wrapper');

                    if (notifWrapper) {

                        notifWrapper.querySelectorAll('.main-notification-item').forEach((notifItem) => {
                            let dateCreated = notifItem.getAttribute('data-date');

                            notifItem.querySelector('.notif-date-wrapper').textContent = globalFuncObj.timeAgo(new Date(globalFuncObj.toJavascriptDateTime(dateCreated)));
                        });

                        if (notifWrapper.querySelector('.no-notifications-small')) {
                            notifWrapper.querySelector('.no-notifications-small').remove();
                        }

                        notifWrapper.querySelector('.jsNotifItemWrapper').prepend(homeObjFunc.notificationItemDivClone(notifData));
                    }
                    else {
                        homeObjFunc.rightPanel.innerHTML = '';

                        let notifWrapperClone = homeObjFunc.notificationWrapperDivClone();

                        if (notifWrapper.querySelector('.no-notifications-small')) {
                            notifWrapper.querySelector('.no-notifications-small').remove();
                        }

                        notifWrapperClone.querySelector('.jsNotifItemWrapper').appendChild(homeObjFunc.notificationItemDivClone(notifData));

                        homeObjFunc.rightPanel.appendChild(notifWrapperClone);

                    }
                }
            }
        }
    },
    send: function (msgObj) {
        this.ws.send(msgObj);
    }
};


const chatSocketObj = {

    chatMemberData: [],

    chatItemDivClone: function () {

        let div = `
            <div class="chat-content-item-container">
                <small class="chat-item-datetime"></small>
                <div class="chat-items owner">
                    <div class="chat-profile-container">
                        <img src="/images/home/default-image.jpg" alt="image" class="chat-profile-img" />
                    </div>
                    <div class="chat-msg">
                    </div>
                </div>
            </div>
        `;

        return new DOMParser().parseFromString(div, 'text/html').querySelector('.chat-content-item-container');
    },

    ws: null,

    init: function (loginCode) {

        this.ws = new WebSocket(`wss://akonini-socket.azurewebsites.net/`, loginCode);

        this.ws.onopen = function () {

            console.log('chat open');

            //if (data.length > 0) {

            //    data.forEach((item) => {

            //        let obj = {
            //            msg: 'iungerelocus',
            //            room: parseInt(item.ChatID),
            //            userID: AppGlobal.masterPersonID
            //        };

            //        chatSocketObj.ws.send(JSON.stringify(obj));
            //    });

            //    setInterval(function () {
            //        chatSocketObj.ws.send(JSON.stringify({ userID: AppGlobal.masterPersonID, msg: 'Refreshed' }));
            //    }, 31000);
            //}

        }

        this.ws.onclose = function () {

            chatSocketObj.init(loginCode);
        }

        this.ws.onmessage = async function (evt) {

            let messageData = JSON.parse(evt.data);

            console.log(messageData);

            const event = new CustomEvent('chat', { detail: evt.data });

            document.body.dispatchEvent(event);

            //if (!messageData.NewMessage) {

            //    if (messageData.length > 0) {
            //        chatSocketObj.senderList = messageData;
            //    }
            //}

            //else {
            //    let chatBox = document.querySelector('.jsChatContainer');

            //    if (chatBox) {

            //        let chatContainer = document.querySelector('.jsChatContents');

            //        let chatID = parseInt(document.querySelector('.jsChatContents').getAttribute('data-chatID'));

            //        let roomID = parseInt(messageData.room);

            //        if (chatID == roomID) {

            //            if (messageData.msg != 'iungerelocus') {

            //                let chatItem = chatSocketObj.chatItemDivClone();

            //                if ((/True/).test(messageData.isDeleted) == false) {

            //                    let p = document.createElement('p');
            //                    p.classList.add('chat-msg-p');

            //                    if ((/True/).test(messageData.IsAttachment) == true) {

            //                        let encodedfileName = btoa(messageData.msg);

            //                        let fileName = messageData.msg.split('|')[1];
            //                        let fileUrl = `${AppGlobal.filePath}${messageData.msg.split('|')[0]}`;

            //                        if (RegExpDataValidationPatterns.isImage.test(fileName)) {

            //                            let img = document.createElement('img');
            //                            img.src = fileUrl;
            //                            img.alt = 'preview-img';
            //                            img.setAttribute('class', 'chat-files chat-imageFiles jsChatFiles');

            //                            img.setAttribute('data-fileName', fileName);
            //                            img.setAttribute('data-encodedFileName', encodedfileName);

            //                            //add click event
            //                            globalFuncObj.chatFileOpenModal(img);

            //                            //append
            //                            p.classList.add('image-content');
            //                            p.appendChild(img);
            //                        }
            //                        else {
            //                            let span = document.createElement('span');
            //                            span.setAttribute('data-href', fileUrl);
            //                            span.textContent = fileName;
            //                            span.setAttribute('class', 'chat-files jsChatFiles span-file-wrapper');
            //                            span.setAttribute('data-fileName', fileName);
            //                            span.setAttribute('data-encodedFileName', encodedfileName);


            //                            //add click event
            //                            globalFuncObj.chatFileOpenModal(span);

            //                            //append
            //                            p.appendChild(span);
            //                        }

            //                    }
            //                    else {
            //                        let msgArr = messageData.msg.split(' ');

            //                        msgArr.forEach((item) => {

            //                            if (globalFuncObj.isValidUrl(item)) {

            //                                let a = document.createElement('a');
            //                                a.textContent = item;
            //                                a.setAttribute('href', item);
            //                                a.setAttribute('target', '_blank');

            //                                p.appendChild(a);
            //                            }
            //                            else {
            //                                p.textContent += `${item} `;
            //                            }
            //                        });
            //                    }


            //                    //add datetime

            //                    chatItem.querySelector('.chat-item-datetime').textContent = globalFuncObj.timeAgo(messageData.dateAdded);

            //                    chatItem.querySelector('.chat-items').setAttribute('data-userid', messageData.userID);
            //                    chatItem.querySelector('.chat-items').setAttribute('data-id', messageData.ID);

            //                    if (messageData.MasterPersonID == AppGlobal.masterPersonID) {
            //                        //chatItem.querySelector('.chat-items').appendChild(chatGlobalMobileObj.chatItemOptionDiv());
            //                    }

            //                    //check if the agent has agent to create new item of chat-item
            //                    if (chatContainer.children.length == 0) {

            //                        chatItem.querySelector('.chat-msg').appendChild(p);
            //                    }
            //                    else {

            //                        let lastMsg = chatContainer.children[chatContainer.children.length - 1];

            //                        let lastMsgUserID = lastMsg.querySelector('.chat-items').getAttribute('data-userid');

            //                        if (lastMsgUserID == messageData.userID) {

            //                            lastMsg.querySelector('p').setAttribute('style', 'margin-bottom: 5px');

            //                            lastMsg.removeAttribute('style');

            //                            lastMsg.querySelector('.chat-profile-img').setAttribute('style', 'visibility: hidden');

            //                            if (messageData.userID != AppGlobal.masterPersonID) {

            //                                chatItem.querySelector('.chat-items').classList.remove('owner');
            //                            }

            //                        }
            //                        else {

            //                            lastMsg.setAttribute('style', 'padding-bottom: 45px');

            //                            if (messageData.userID != AppGlobal.masterPersonID) {

            //                                chatItem.querySelector('.chat-items').classList.remove('owner');
            //                            }
            //                        }

            //                        chatItem.querySelector('.chat-msg').appendChild(p);

            //                    }

            //                    let itemObj = {
            //                        id: parseInt(messageData.ID),
            //                        value: chatItem,
            //                        Message: messageData.msg
            //                    };

            //                    //add to variable obj
            //                    //chatGlobalMobileObj.chatMessageListArr.push(itemObj);

            //                    chatContainer.appendChild(itemObj.value);


            //                    chatContainer.scrollTop = chatContainer.scrollHeight;

            //                }

            //                else {
            //                    if (chatGlobalMobileObj.chatMessageListArr.length > 0) {
            //                        //let msgItem = chatGlobalMobileObj.chatMessageListArr.find(x => x.id == messageData.ID);

            //                        if (msgItem) {

            //                            let msgItemEl = msgItem.value;

            //                            msgItemEl.querySelector('.chat-items').classList.add('isDeleted');

            //                            if (msgItemEl.querySelector('.chat-item-option')) {
            //                                msgItemEl.querySelector('.chat-item-option').remove();
            //                            }

            //                            msgItemEl.querySelector('.chat-msg-p').textContent = 'This message was removed';
            //                        }
            //                    }
            //                }

            //            }

            //        }

            //    }
            //    else {
            //        let messageSenderListDiv = document.querySelector('.jsMessage-wrapper');

            //        if (messageSenderListDiv) {

            //            messageSenderListDiv.querySelectorAll('.jsMessageContainer').forEach((item) => {

            //            });
            //        }
            //    }
            //}

        }
    },
    send: function (msgObj) {

        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(msgObj);
        }
        else {
            setTimeout(function () {
                chatSocketObj.send(msgObj);
            }, 2000)
        }

    },

}


class LinkedList_Node {
    constructor(value) {
        this.value = value
        this.next = null
    }
}

class LinkedList {
    constructor(value) {
        //const newNode = new LinkedList_Node(value)
        //this.head = newNode
        //this.tail = this.head
        //this.length = 1
        this.head = null
        this.tail = null
        this.length = 0
    }

    push(value) {
        const newNode = new LinkedList_Node(value)
        if (!this.head) {
            this.head = newNode
            this.tail = newNode
        } else {
            this.tail.next = newNode
            this.tail = newNode
        }
        this.length++
        return this
    }

    pop() {
        if (!this.head) return undefined
        let temp = this.head
        let pre = this.head
        while (temp.next) {
            pre = temp
            temp = temp.next
        }
        this.tail = pre
        this.tail.next = null
        this.length--
        if (this.length === 0) {
            this.head = null
            this.tail = null
        }
        return temp
    }

    unshift(value) {
        const newNode = new LinkedList_Node(value)
        if (!this.head) {
            this.head = newNode
            this.tail = newNode
        } else {
            newNode.next = this.head
            this.head = newNode
        }
        this.length++
        return this
    }

    shift() {
        if (!this.head) return undefined
        let temp = this.head
        this.head = this.head.next
        this.length--
        if (this.length === 0) {
            this.tail = null
        }
        temp.next = null
        return temp
    }

    get(index) {
        if (index < 0 || index >= this.length) return undefined
        let temp = this.head
        for (let i = 0; i < index; i++) {
            temp = temp.next
        }
        return temp
    }

    set(index, value) {
        let nodeToUpdate = this.get(index)
        if (nodeToUpdate) {
            nodeToUpdate.value = value
            return true
        }
        return false
    }

    insert(index, value) {
        if (index < 0 || index > this.length) return false
        if (index === this.length) return this.push(value)
        if (index === 0) return this.unshift(value)

        const newNode = new Node(value)
        const temp = this.get(index - 1)
        newNode.next = temp.next
        temp.next = newNode
        this.length++
        return true
    }

    remove(index) {
        if (index < 0 || index >= this.length) return undefined
        if (index === 0) return this.shift()
        if (index === this.length - 1) return this.pop()

        const before = this.get(index - 1)
        const temp = before.next

        before.next = temp.next
        temp.next = null
        this.length--
        return temp
    }

    reverse() {
        let temp = this.head
        this.head = this.tail
        this.tail = temp
        let next = temp.next
        let prev = null
        for (let i = 0; i < this.length; i++) {
            next = temp.next
            temp.next = prev
            prev = temp
            temp = next
        }
        return this
    }

    indexOf(PropertyName, SearchString) {
        let results = []
        let temp = this.head
        for (let i = 0; i < this.length; i++) {
            if (temp.value[PropertyName].toLowerCase().indexOf(SearchString.toLowerCase()) !== -1) results.push(temp.value)
            temp = temp.next
        }
        return results
    }

    getAll() {
        let results = []
        let temp = this.head
        for (let i = 0; i < this.length; i++) {
            results.push(temp.value)
            temp = temp.next
        }
        return results
    }

    getSelectedItemsArray(PropertyName, ID) {
        let results = []
        let temp = this.head
        for (let i = 0; i < this.length; i++) {
            if (temp.value[`${PropertyName}`] == ID) {
                results.push(temp.value)
            }
            temp = temp.next
        }
        return results
    }

    getUniquePropertyName() {
        let results = []
        let temp = this.head
        //results.push(temp.value)
        for (let i = 0; i < this.length; i++) {

            let exist = false;

            for (let x = 0; x < results.length; x++) {
                if (JSON.stringify(results[x]) === JSON.stringify(temp.value)) {
                    exist = true;
                }
            }
            if (!exist) {
                results.push(temp.value)
            }

            temp = temp.next
        }

        return results
    }

    getAllByID(propertyName, id) {
        if (this.head == null) return undefined

        let arr = []
        let temp = this.head

        for (let i = temp; i != null; i = i.next) {
            if (i.value[propertyName] == id) {
                arr.push(i.value)
            }
        }

        return arr;
    }

    getExact(propertyName, searchString) {
        let results = []
        let temp = this.head
        for (let i = 0; i < this.length; i++) {
            if (temp.value[propertyName].toLowerCase() == searchString.toLowerCase()) results.push(temp.value)
            temp = temp.next
        }
        return results
    }

    getByID(id) {
        if (this.head == null) return undefined;

        let temp = this.head;

        if (id > 0) {

            while (temp.value.ID != id) {
                temp = temp.next;
            }

            return temp.value;
        }

        return null;
    }
}

class BST_Node {
    constructor(value) {
        this.value = value
        this.left = null
        this.right = null
    }
}
class BinarySearchTree {
    constructor() {
        this.root = null
        this.length = 0
    }

    insert(value, targetProperty) {

        const newNode = new BST_Node(value)
        if (this.root === null) {
            this.root = newNode
            this.length++
            return this
        }
        let temp = this.root
        while (true) {
            if (newNode.value[targetProperty] === temp.value[targetProperty]) return undefined
            if (newNode.value[targetProperty] < temp.value[targetProperty]) {
                if (temp.left === null) {
                    temp.left = newNode
                    this.length++
                    return this
                }
                temp = temp.left
            } else {
                if (temp.right === null) {
                    temp.right = newNode
                    this.length++
                    return this
                }
                temp = temp.right
            }
        }
    }

    contains(value) {
        if (this.root === null) return false
        let temp = this.root
        while (temp) {
            if (value.ID < temp.value.ID) {
                temp = temp.left
            } else if (value.ID > temp.value.ID) {
                temp = temp.right
            } else {
                return true
            }
        }
        return false
    }

    getAll() {
        let currentNode = this.root
        let results = []
        let queue = []
        queue.push(currentNode)

        while (queue.length) {
            currentNode = queue.shift()
            results.push(currentNode.value)
            if (currentNode.left) queue.push(currentNode.left)
            if (currentNode.right) queue.push(currentNode.right)
        }
        return results
    }

    getAllByID(ItemProperty, PropertyValue) {
        let currentNode = this.root
        let results = []
        let queue = []
        queue.push(currentNode)

        while (queue.length) {
            currentNode = queue.shift()

            if (currentNode.value[ItemProperty] == PropertyValue) results.push(currentNode.value)
            if (currentNode.left) queue.push(currentNode.left)
            if (currentNode.right) queue.push(currentNode.right)
        }
        return results
    }

    indexOf(PropertyName, SearchString) {

        let currentNode = this.root
        let results = []
        let queue = []
        queue.push(currentNode)

        while (queue.length) {

            currentNode = queue.shift()


            if (currentNode.value[PropertyName].toString().toLowerCase().indexOf(SearchString.toLowerCase()) !== -1) results.push(currentNode.value)
            if (currentNode.left) queue.push(currentNode.left)
            if (currentNode.right) queue.push(currentNode.right)
        }
        return results
    }

    BFSbyParentAndIndexOf(SearchString, PropertyName, PropertyParentID, ParentID) {
        let currentNode = this.root
        let results = []
        let queue = []
        queue.push(currentNode)

        while (queue.length) {
            currentNode = queue.shift()

            if (currentNode.value[PropertyName].toLowerCase().indexOf(SearchString.toLowerCase()) !== -1 && currentNode.value[PropertyParentID] == ParentID) {
                results.push(currentNode.value)
            }
            if (currentNode.left) queue.push(currentNode.left)
            if (currentNode.right) queue.push(currentNode.right)
        }
        return results
    }

    getUniquePropertyName() {
        return this.getAll();
    }

    getExact(propertyName, searchString) {
        let currentNode = this.root
        let results = []
        let queue = []
        queue.push(currentNode)

        while (queue.length) {
            currentNode = queue.shift()

            if (currentNode.value[propertyName].toLowerCase() == searchString.toLowerCase()) results.push(currentNode.value)
            if (currentNode.left) queue.push(currentNode.left)
            if (currentNode.right) queue.push(currentNode.right)
        }
        return results
    }
}


//-------------Alert Type and Messages---------------------//
const alertMessages = {
    saveSuccessfull: 'Save Successfull!',
    updateSuccessfull: 'Update Successfull!',
    deleteSuccessfull: 'Successfully Deleted!',
    inputFormat: `Invalid input character!`,
    databaseError: `Database Error!`,
    duplicateError: `File already exist in database!\n Modify file name!`,
    serverError: `Server Error!`,
    delDatabaseItem: `Are you sure? \n This will be permanently deleted!`,
    createProjectFirst: `Create and save Project Name first!`,
    sessionExpired: `Session Expired.`,
    throttleError: 'Throttle Error'
}

const alertType = {

    successAlert: {
        iconClassName: 'alert-header-icon-success',
        colorClassName: 'color-success',
        headerText: 'Success..',
        imageSrc: "/icon/check-solid.svg"
    },

    errorAlert: {
        iconImageClassName: 'alert-header-icon-error',
        colorClassName: 'color-error',
        headerText: 'Error message..',
        imageSrc: "/icon/xmark-solid.svg"
    },

    warningAlert: {
        iconImageClassName: 'alert-header-icon-warning',
        colorClassName: 'color-warning',
        headerText: 'Warning..',
        imageSrc: "/icon/triangle-exclamation-solid.svg"
    },

    criticalAlert: {
        iconImageClassName: 'alert-header-icon-critical',
        colorClassName: 'color-critical',
        headerText: 'Critical..',
        imageSrc: "/icon/triangle-exclamation-solid.svg"
    }

}

const loader = {
    start: function () {
        const spinner = `<div id="preloader__wrapper">
                            <div class="bg__overlay">
                                <div class="lds-spinner">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        </div>`;
        const parseDoc = new DOMParser().parseFromString(spinner, 'text/html').querySelector('#preloader__wrapper');

        document.body.append(parseDoc);

    },
    stop: function () {
        document.querySelector('#preloader__wrapper').remove();
    }
}


document.querySelectorAll('.jsComingSoon').forEach((item) => {

    item.addEventListener('click', function (e) {

        globalFuncObj.isConfirmedAlertOk(alertType.warningAlert, 'Coming soon.');

        if (document.querySelector('.jsLeftMenuContainer')) {
            document.querySelector('.jsLeftMenuContainer').classList.add('hidden');
        }

    });

});