﻿


export default function inventoryMapNew(projectObj) {

    let contentWrapper = document.querySelector('.jsContentWrapper');

    let projectID = projectObj.ProjectID;
    let projectName = projectObj.ProjectName;

    let svgDoc = null;
    let file = null;

    async function mainHtml() {

        contentWrapper.innerHTML = '';

        let view = await globalFuncObj.fetchView(AppGlobal.baseUrl + `inventorymapupload`);

        let doc = new DOMParser().parseFromString(view, 'text/html').querySelector('.jsInventoryMapContainer');

        let svgContainer = doc.querySelector('.jsSvgFileContainer');

        let svgFileInput = doc.querySelector('.jsSVGFileInput');

        let uploadBtn = doc.querySelector('.jsUploadBtn');

        svgContainer.addEventListener('click', handleClickSVGUploadContainer);

        svgFileInput.addEventListener('change', handleSVGFileInputChange)

        uploadBtn.addEventListener('click', handleClickUploadBtn);

        doc.querySelector('.jsProjectTitle').textContent = projectName;

        doc.querySelector('.jsBack').addEventListener('click', handleBackButtonClick);

        contentWrapper.appendChild(doc);

    }

    function handleBackButtonClick() {
        history.back();
    }

    async function handleClickUploadBtn(e) {

        globalFuncObj.loader.start();

        if (validateFile() && validateForm()) {

            let uploadAzureFunc = await uploadAzure();

            console.log(uploadAzureFunc);

            if (uploadAzureFunc.StatusCodeNumber == 1) {

                let formData = new FormData();

                formData.append('SVGFileName', uploadAzureFunc.FileName);
                formData.append('MasterProjectID', projectID);

                extractSVG().forEach((item, index) => {

                    formData.append(`ProjectLots[${index}].MasterProjectID`, projectID);
                    formData.append(`ProjectLots[${index}].LotID`, item);

                });

                saveToDatabase(formData);
            }
        }

    }

    async function saveToDatabase(formData) {

        if (validateForm()) {

            let imageCaption = document.querySelector('.jsImageCaption');

            formData.append('ImageCaption', imageCaption.value);

            let data = await globalFuncObj.fetchDataPost(AppGlobal.baseUrl + 'inventory-map/new', formData);

            console.log(data);


            if (data.HasError) {
                throw alertMessages.databaseError
            }
            else {
                if (data.StatusCodeNumber == 1) {

                    globalFuncObj.isConfirmedAlertOk(alertType.successAlert, 'Saved Successfully.');
                }

                else if (data.StatusCodeNumber == 2) {
                    globalFuncObj.isConfirmedAlertOk(alertType.warningAlert, 'Inventory Map already exists');

                }
            }

            globalFuncObj.loader.stop();
        }

    }

    function validateForm() {

        let errors = 0;

        let imageCaption = document.querySelector('.jsImageCaption');

        if (imageCaption.value) {
            imageCaption.removeAttribute('style');
        }

        else {
            errors += 1;
            imageCaption.setAttribute('style', 'border: 1px solid red');
        }



        return errors == 0 ? true : false;
    }

    function validateFile() {
        let errors = 0;

        if (file == null) {
            errors += 1;
            document.querySelector('.jsSvgFileContainer').setAttribute('style', 'border: 1px solid red');

        }
        else {
            document.querySelector('.jsSvgFileContainer').removeAttribute('style');

        }

        return errors == 0 ? true : false;

    }

    function extractSVG() {

        let dataLotID = [];

        svgDoc.querySelectorAll('[data-lotid]').forEach((item) => {

            dataLotID.push(item.getAttribute('data-lotid'));

        });

        return dataLotID;

    }

    async function uploadAzure() {

        let fileFormData = new FormData();
        fileFormData.append('file', file);

        let fileData = await globalFuncObj.fetchUploadFile('https://akonini-files.azurewebsites.net/uploadsvg', fileFormData);

        return fileData;
    }

    function handleClickSVGUploadContainer(e) {

        e.currentTarget.querySelector('.jsSVGFileInput').click();
    }

    async function handleSVGFileInputChange(e) {

        let parentEl = e.target.closest('.jsSvgFileContainer');

        let filePart = this.files[0].name.split('.');

        let fileType = filePart[filePart.length - 1];

        file = this.files[0];

        //console.log(this.files[0]);

        if (fileType == 'svg') {

            const reader = new FileReader();

            reader.onload = async function () {

                parentEl.querySelector('.jsSVGFilePreview').src = reader.result;

                parentEl.querySelector('small').setAttribute('style', 'display: none');


                await fetch(reader.result).then(function (obj) {

                    return obj.text();

                }).then(function (data) {

                    //console.log(data);

                    svgDoc = new DOMParser().parseFromString(data, 'text/html').querySelector('svg');

                    //console.log(svgDoc);
                })
            }

            reader.readAsDataURL(this.files[0]);


            
        }
    }

    return {
        init: async function () {

            globalFuncObj.loader.start();

            await mainHtml();

            globalFuncObj.loader.stop();
            
        }
    }

}