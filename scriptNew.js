"use strict"

function slider() {
   const
      slider = document.querySelector('.slider'),
      wrap = document.querySelector('.slider_wrapper'),
      sliderWidth = parseFloat(getComputedStyle(slider).width), // Ширина слайдера
      wrapWidth = parseFloat(getComputedStyle(wrap).width), // Ширина обертки
      itemWidth = parseFloat(getComputedStyle(document.querySelectorAll('.slider_item')[0]).width),
      arrayItems = [...document.querySelectorAll('.slider_item')],
      sliderWidthproc = sliderWidth / 100, // Ширина экрана в процентах
      // sliderWidthproc = sliderWidth / document.documentElement.clientWidth * 100, // Ширина слайдера в процентах
      visibleElem = Math.floor(sliderWidth / itemWidth),
      step = 100 / visibleElem; // шаг слайдера в процентах

      console.log('visibleElem =', visibleElem);
      // sliderWidthproc = sliderWidth / 100
      let wrapWidthproc = step * arrayItems.length; // Ширина обертки в процентах

      console.log('sliderWidthproc = ', sliderWidthproc)
      console.log('sliderWidth = ', sliderWidth)
      console.log(sliderWidth / document.documentElement.clientWidth * 100)


      // arrayItems = [];
      // items.forEach((item, index) => {
      //    arrayItems.push(item);
      // });

      // console.log('wrapWidthproc =', wrapWidthproc);
      // wrap.style.transform = `translateX(30%)`

   let
      direction = 'right',
      transform = 0;

   // controls elements
   const
      arraySliderControls = [...document.querySelectorAll('.slider_control')],
      arrayRight = document.querySelector('.slider_control_right'),
      arrayLeft = document.querySelector('.slider_control_left'),
      arrayShow = document.querySelector('.slider_control_show');



      arraySliderControls.forEach(item => {
         item.addEventListener('click', () => {
            direction = item.classList.contains('slider_control_right') ? 'right' : 'left';
            transformSlider()
         })
      })

      // округляем строку или число, переводим в число.
      function abs(num) {
         num = +num;
         return Math.abs(num.toFixed(3));
      }
      // function str(num) {
      //    num = Math.abs(num.toFixed(3)).toString();
      //    return num;
      // }

      function minMaxTransform() {
         if( transform >= 0 ) {
            return false;
         }
         if(transform < 0 ) {
            // if( abs(transform) >= abs(wrapWidthproc - 100)) {
            //    return false;
            // }
            return true;
         }
      }

      function getArray(direction_show, direction_remove) {
         if( minMaxTransform() ) {
            direction_show.classList.add('slider_control_show');
         }
         if( !minMaxTransform() ) {
            direction_remove.classList.remove('slider_control_show');
         }
       }

      function transformSlider() {
         // transform = abs(transform);
         wrap.style.transition = '.3s';

         if (direction === 'right' ) {
            transform -= step;
            getArray(arrayLeft, arrayRight)
         }
         if (direction === 'left' ) {
            transform += step;
            getArray(arrayRight, arrayLeft)
         }
         wrap.style.transform = `translateX(${transform}%)`

         // console.log(minMaxTransform())
         console.log('transformSlider() transform =', transform);
      }


      function touchHandler() {
         const mouse = {
            down: 0, //относительно длины слайдера
            move: 0,
            downS: 0, //относительно длины окна
            trans: 0,
         }
         let transformTouch;

         function getDirection(e) {

            direction = mouse.down > mouse.move? 'right' : 'left'
            console.log('direction =', direction);
            console.log('mouse.down =', mouse.downS);
            console.log('mouse.move =', mouse.move);
         }


         slider.addEventListener('mousedown', (e) => {
            if( !e.target.classList.contains('slider_control') ) {
               mouse.downS = e.clientX / document.documentElement.clientWidth * 100
               mouse.down = e.clientX / sliderWidth * 100;
               mouse.trans = transformTouch;
            }
         })

         slider.addEventListener('mousemove', (e) => {

            transformTouch = -transform;
            console.log('transformTouch =', transformTouch);
            wrap.style.transition = '.0s';

            if( e.which === 1 ) {
               getDirection(e)
               mouse.move = mouse.down - e.clientX / sliderWidth * 100;

               transformTouch = mouse.move + mouse.trans;
               // console.log('mouse.trans =', mouse.trans);

               if( transformTouch < 0 ) {
                  transformTouch = 0
               }

               // if( transformTouch >= 80 ) {
               //    alert('jhy')
               // }
               console.log('transformTouch = ', transformTouch)


               wrap.style.transform = `translateX(${-transformTouch}%)`;
               // console.log('transformTouch =', transformTouch);
            }




         })

         slider.addEventListener('mouseup', (e) => {
            if( !e.target.classList.contains('slider_control') ) {
               transform = -transformTouch;
            }

         })
      }
      touchHandler();










};

slider();
