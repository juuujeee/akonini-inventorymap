


export default function inventoryMapNew(projectObj) {

    let contentWrapper = document.querySelector('.jsContentWrapper');

    let projectID = projectObj.ProjectID;
    let projectName = projectObj.ProjectName;

    let svgDoc = null;
    let file = null;

    function mainHtml() {

        contentWrapper.innerHTML = `
            <div class="home-page-mainContainer jsInventoryMapContainer">
                <div class="page-filter">
                    <i class="jsBack back-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" style="height: 20px;"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"></path></svg>
                    </i>
                    <h3 class="page-filter-title jsProjectTitle" style="text-transform: capitalize"></h3>
                </div>
                <div class="home-page-container">

                    <div class="home-page-projectList">
                        <div class="projectList-header" style="grid-template-columns: 1fr">
                            <div class="projectList-header-title">
                                <h3>Upload Inventory Map</h3>
                            </div>
                        </div>

                        <div class="projectlist-body">
                            <div class="svgFileUploadContainer jsSvgFileContainer">
                                <input type="file" class="SVGFileInput jsSVGFileInput" hidden accept=".svg"/>
                                <img src="" class="SVGFilePreview jsSVGFilePreview"/>
                                <small>Click to Open file</small>
                            </div>
                            <div class="projectinventorymap-form-group">
                                <input type="text" name="ImageCaption" class="jsImageCaption" placeholder="Image Caption" required/>
                            </div>
                            <div class="UploadBtnContainer">
                                <button class="svg-upload-btn jsUploadBtn">Upload</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;

        //let view = await globalFuncObj.fetchView(AppGlobal.baseUrl + `inventorymapupload`);

        //let doc = new DOMParser().parseFromString(view, 'text/html').querySelector('.jsInventoryMapContainer');

        //contentWrapper.appendChild(doc);

        let svgContainer = contentWrapper.querySelector('.jsSvgFileContainer');

        let svgFileInput = contentWrapper.querySelector('.jsSVGFileInput');

        let uploadBtn = contentWrapper.querySelector('.jsUploadBtn');

        svgContainer.addEventListener('click', handleClickSVGUploadContainer);

        svgFileInput.addEventListener('change', handleSVGFileInputChange)

        uploadBtn.addEventListener('click', handleClickUploadBtn);

        contentWrapper.querySelector('.jsProjectTitle').textContent = projectName;

        contentWrapper.querySelector('.jsBack').addEventListener('click', handleBackButtonClick);

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

                //let arr = [];

                //let i = 0;

                extractSVG().forEach((item, index) => {

                    //if (index > 590) {


                    //    i++;
                    //}

                    formData.append(`ProjectLots[${index}].LotID`, item);


                    //formData.append(`ProjectLots[${index}].MasterProjectID`, projectID);


                });

                saveToDatabase(formData);
            }
        }


        globalFuncObj.loader.stop();

    }

    async function saveToDatabase(formData) {

        if (validateForm()) {

            globalFuncObj.loader.start();

            let imageCaption = document.querySelector('.jsImageCaption');

            formData.append('ImageCaption', imageCaption.value);

            //formData.ImageCaption = imageCaption.value;

            let data = await globalFuncObj.fetchDataPost(AppGlobal.baseUrl + 'inventory-map/new', formData);

            //console.log(data);

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

            mainHtml();

            globalFuncObj.loader.stop();
            
        }
    }

}