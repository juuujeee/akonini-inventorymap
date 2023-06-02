function loginFunc() {

    let loginBtn = document.querySelector('.jsLoginBtn');

    if (loginBtn) {
        loginEvents(loginBtn)
    }


    function loginEvents(loginBtn) {
        let parentEl = loginBtn.closest('form');

        loginBtn.addEventListener('click', function (e) {

            login();

        });

        //parentEl.addEventListener('input', function (e) {

        //    let name = e.target.name;
        //    let val = e.target.value;

        //    switch (name) {

        //        case 'Username':

        //            if (!RegExpDataValidationPatterns.EmailAddress.test(val)) {
        //                e.target.setAttribute('style', 'border: 1px solid red');
        //                loginBtn.setAttribute('disabled', 'disabled');
        //            }
        //            else {
        //                e.target.removeAttribute('style');
        //                loginBtn.removeAttribute('disabled');
        //            }

        //            break;

        //        case 'Password':

        //            if (!RegExpDataValidationPatterns.strongPassword.test(val)) {
        //                e.target.setAttribute('style', 'border: 1px solid red');
        //                loginBtn.setAttribute('disabled', 'disabled');
        //            }
        //            else {
        //                e.target.removeAttribute('style');
        //                loginBtn.removeAttribute('disabled');
        //            }

        //            break;
        //    }
        //});

        parentEl.addEventListener('keydown', function (e) {

            switch (e.which) {
                case 13:

                    if (!loginBtn.hasAttribute('disabled')) {
                        login();
                    }

                    break;
            }

        });

        async function login() {

            let msgEl = document.createElement('p');
            msgEl.setAttribute('class', 'return-msg jsReturnMsg');

            if (validateForm(parentEl)) {

                let formData = new FormData();

                formData.append('UserName', parentEl.querySelector('.jsUserName').value);
                formData.append('IStillLoveYou', parentEl.querySelector('.jsPassword').value);


                //remove the text in button and show the preloader/spinner
                //add pointer-events in parent element
                loginBtn.textContent = '';
                loginBtn.classList.add('spinner');
                parentEl.setAttribute('style', 'pointer-events: none');

                if (parentEl.querySelector('.jsReturnMsg')) {
                    parentEl.querySelector('.jsReturnMsg').remove();
                }

                parentEl.querySelector('.login-header').removeAttribute('style');

                let data = await globalFuncObj.fetchDataPost(AppGlobal.baseUrl + 'User/Login', formData);

                //add the text in button and remove the preloader/spinner
                //remove the pointer-events in parent element
                loginBtn.textContent = 'Login';
                loginBtn.classList.remove('spinner');
                parentEl.removeAttribute('style');

                //console.log(data);

                if (data.HasError) {
                    throw alertMessages.databaseError;
                }

                else {

                    if (data.StatusCodeNumber == 1) {

                        //success here
                        //redirect to home page
                        window.location.href = `${AppGlobal.baseUrl}`;

                    }
                    else if (data.StatusCodeNumber == 2) {

                        //wrong credentials
                        //IsConfirmedAlertOk(alertType.errorAlert, 'Invalid username or password');
                        msgEl.classList.add('error-message');
                        msgEl.innerHTML = '<b>Error</b> </br> Invalid email or password';

                    }
                    else {

                        //email not verified
                        //IsConfirmedAlertOk(alertType.warningAlert, 'Email not verified.');
                        msgEl.classList.add('error-message');
                        msgEl.innerHTML = '<b>Error</b> </br> Email not verified';
                    }
                }

                if (msgEl.textContent) {
                    parentEl.querySelector('.login-body').insertBefore(msgEl, parentEl.querySelector('.login-body').children[0]);
                    //parentEl.setAttribute('style', 'height: 550px');

                    parentEl.querySelector('.login-header').setAttribute('style', 'margin-bottom: 0');
                }
            }

        }
    }

    function validateForm(parentEl) {
        let errors = 0;

        parentEl.querySelectorAll('input[required]').forEach((item) => {

            if (item.value) {
                item.removeAttribute('style');
            }
            else {
                errors += 1;

                item.setAttribute('style', 'border: 1px solid red');
            }

        });

        return errors == 0 ? true : false;
    }

}

