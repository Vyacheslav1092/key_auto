import IMask from 'imask'
IMask(document.querySelector('input[type="tel"]'), { mask: '+{7} (000) 000-00-00' });

document.addEventListener('DOMContentLoaded', () => {

    if (document.getElementById('registration')) {
        // drop down
        let selection = document.getElementById('registration');
        let role = document.getElementById('role');
        let dropdown = document.querySelector('.js-drop');
        let roleTreangle = document.querySelector('.js-treangle');
        let roleItems = document.querySelectorAll('.js-role-item');

        role.value = dropdown.children[0].textContent.trim();

        role.addEventListener('click', function (e) {
            e._notClose = true;
            roleTreangle.classList.toggle('active');
            dropdown.classList.toggle('active');
        })

        for (let item of roleItems) {
            item.addEventListener('click', function (e) {
                e._notClose = true;
                role.value = item.textContent.trim();

                roleTreangle.classList.remove('active');
                dropdown.classList.remove('active');
            })
        }

        selection.addEventListener('click', e => {
            if (e._notClose) return;

            roleTreangle.classList.remove('active');
            dropdown.classList.remove('active');
        })


        //validation form
        let wrap = document.querySelector('.js-wrap');
        let form = document.getElementById('form');
        let inputName = document.getElementById('name');
        let inputFamily = document.getElementById('family');
        let inputEmail = document.getElementById('email');
        let inputTel = document.getElementById('tel');
        let inputCity = document.getElementById('city');
        let inputRole = document.getElementById('role');
        let checkbox = document.getElementById('check');
        let reqFields = form.querySelectorAll('.field');
        let sendButton = document.querySelector('.js-btn-send');
        let thanksPopup = document.getElementById('thanks');
        const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;


        let arry3Length = [inputName, inputFamily, inputCity];


        inputEmail.addEventListener('input', () => {
            inputEmail.value = inputEmail.value.replace(/[А-Яа-яЁё]/g, '');

            function onInput() {
                if (isEmailValid(inputEmail.value)) {
                    removeValidation();
                    sendButton.classList.remove('desabled');
                } else {
                    removeValidation();

                    inputEmail.classList.add('is-invalid');
                    sendButton.classList.add('desabled');
                }
            }
            onInput();
        })

        function isEmailValid(value) {
            return EMAIL_REGEXP.test(value)
        }


        inputName.addEventListener('input', function () {
            if (inputName.value !== '') {
                sendButton.classList.remove('desabled');
            } else {
                sendButton.classList.add('desabled');
            }
        })



        let checkLength = function () {
            for (let input of arry3Length) {
                input.addEventListener('input', () => {
                    input.value = input.value.replace(/[0-9]/g, '');
                });
            };
        };

        let generateError = function (text) {
            let error = document.createElement('span');
            error.classList.add('field-error');
            error.innerHTML = text;

            return error;
        };

        let removeValidation = function () {
            let errors = document.querySelectorAll('.field-error');
            let errorsBorder = form.querySelectorAll('.is-invalid');

            for (let i = 0; i < errors.length; i++) {
                errors[i].remove();
            };

            for (let i = 0; i < errorsBorder.length; i++) {
                errorsBorder[i].classList.remove('is-invalid');
            };

            sendButton.classList.remove('desabled');
        };

        let checkFieldsPresons = function () {
            for (let field of reqFields) {
                if (!field.value) {
                    let errors = document.querySelector('.field-error');
                    let error = generateError('Необходимо заполнить все обязательные поля');

                    if (!errors) {
                        window.innerWidth > 1440 ? wrap.append(error) : wrap.insertBefore(error, wrap.children[1])
                    };

                    field.classList.add('is-invalid');
                    sendButton.classList.add('desabled');
                };
            };
        };

        function thanksActive() {
            if (window.innerWidth > 575) {
                thanksPopup.classList.add('active');
                thanksPopup.style.opacity = '1';
            } else {
                thanksPopup.classList.add('active');
                thanksPopup.style.opacity = '1';
                thanksPopup.parentElement.querySelector('.container').style.display = 'none';
            };
        };

        function thanksDesabled() {
            if (window.innerWidth > 575) {
                thanksPopup.style.opacity = '0';
                setTimeout(function () {
                    thanksPopup.classList.remove('active');
                }, 300)
            } else {
                thanksPopup.style.opacity = '0';
                setTimeout(function () {
                    thanksPopup.classList.remove('active');
                    thanksPopup.parentElement.querySelector('.container').style.display = 'flex';
                }, 300);
            };
        };

        function sendToGoogleSheets() {

            const getParam = (param) => {
                const urlParams = new URL(window.location.toString()).searchParams
                return urlParams.get(param) || ''
            }

            const utm_source = getParam('utm_source');
            const utm_medium = getParam('utm_medium');
            const utm_campaign = getParam('utm_campaign');
            const utm_content = getParam('utm_content');

            const formdata = new FormData();

            formdata.append("Name" , inputName.value);
            formdata.append("Family" , inputFamily.value);
            formdata.append("Email" , inputEmail.value);
            formdata.append("Tel" , inputTel.value);
            formdata.append("City" , inputCity.value);
            formdata.append("Role" ,  inputRole.value);
            formdata.append("utm_source" ,  utm_source);
            formdata.append("utm_medium" ,  utm_medium);
            formdata.append("utm_campaign" ,  utm_campaign);
            formdata.append("utm_content" ,  utm_content);

            const requestOptions = {
                method: 'POST',
                mode: 'cors',
                body: formdata,
            };
            fetch("https://script.google.com/macros/s/AKfycbzqAnl8WO7u0a3lmxCmyME-sHzNgEaukivgw-3UKU_4E9lKBAvjX_wEZeHuEQCIJ7aA/exec", requestOptions)
            // .then(() => console.log(requestOptions))
            .catch(error => console.log('error', error));
        }

        form.addEventListener('submit', e => {
            e.preventDefault();

            // sendToGoogleSheets();

            removeValidation();
            checkFieldsPresons();
            checkLength();

            let errors = document.querySelectorAll('.field-error');
            if (errors.length === 0) {
                sendToGoogleSheets();
                let preloader = form.parentElement.querySelector('.post-preloader');


                let formData = new FormData(form);
                let xhr = new XMLHttpRequest();

                preloader.style.display = 'flex';

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            const response = JSON.parse(xhr.responseText);

                            if (response.status === 'Success') {
                                preloader.style.display = 'none';
                                thanksActive();
                                setTimeout(function () {
                                    thanksDesabled();
                                }, 10000);
                                console.log('Отправлено');
                            } else {
                                alert('Заявка не отправлена');
                                preloader.style.display = 'none';
                            }
                        } else {
                            alert('Заявка не отправлена');
                            preloader.style.display = 'none';
                        };
                    };
                };


                xhr.open('POST', 'send.php' + window.location.search, true);
                xhr.send(formData);
                form.reset();
                role.value = dropdown.children[0].textContent.trim();

            };

        });
    };
});