let transform;

const get_slider = (function() {
  return function(slider_class) {

    let
      slider = document.querySelector(slider_class);
      slider_wrapper = slider.querySelector('.slider_wrapper');
      wrapper_width = parseFloat(getComputedStyle(slider_wrapper).width);
      slider_items = slider.querySelectorAll('.slider_item');
      slider_items_div = slider.querySelectorAll('.slider_item div');
      item_width = parseFloat(getComputedStyle(slider_items[0]).width);
      slider_control = slider.querySelectorAll('.slider_control');
      slider_control_right = slider.querySelector('.slider_control_right');
      slider_control_left = slider.querySelector('.slider_control_left');
      step = item_width / wrapper_width * 100;
      position_left_item = 0;
      transform = 0;
      items = [];



    slider_items.forEach((item, index) => {
      items.push({item: item, position: index});
    })
    slider_items_div.forEach((item, index) => {

      item.addEventListener('mousedown', () => {
        return false
      })
    })



    const getPassedElem = () => {
      ;
      const tranStep = Math.abs(transform - step) / step; // Перевод transform из % в шаги. Math.abs - т.к. transform отрицательный, отнимаем step, чтобы узнать значение перед активацией слайдера.
      const elemWindow = Math.round(wrapper_width / item_width); // Количество элементов на экране.
      const passedElem = tranStep + elemWindow; // Количество пройденных элементов в слайдере.
      console.log('right = '+tranStep)
      console.log(passedElem)
      return Math.round(passedElem);
    }

    const getPassedElemLeft = () => {
      const tranStep = Math.abs(transform + step) / step;
      const elemWindow = Math.round(wrapper_width / item_width); // Количество элементов на экране.
      const passedElem = tranStep + elemWindow; // Количество пройденных элементов в слайдере.
      console.log('left = '+tranStep)
      return Math.round(tranStep);
    }

    const get_transform_slider = (direction, stepNew) => {


      if( direction === 'right' ) {

        if( getPassedElem() ===  items.length ) {
          slider_control_right.classList.remove('slider_control_show');
        }
        if(getPassedElem() !==  0) {
          slider_control_left.classList.add('slider_control_show');
        }
        transform -= stepNew;
      }

      if( direction === 'left' ) {

        if( getPassedElemLeft() ===  0 ) {
          slider_control_left.classList.remove('slider_control_show');
        }
        if( getPassedElemLeft() !==  items.length ) {
          slider_control_right.classList.add('slider_control_show');
        }
        transform += stepNew;
      }

      slider_wrapper.style.transition = '.2s';
      slider_wrapper.style.transform = 'translateX(' + transform + '%)';
    }

    let get_direct_control = function() {
      let direction = this.classList.contains('slider_control_right') ? 'right' : 'left';
      get_transform_slider(direction, step);
    }

    let setUp_listener = function() {
      slider_control.forEach(function(item) {
        item.addEventListener('click', get_direct_control)
      })
    }
    setUp_listener();




    function sliderMouseMove() {
      const mouseHandler = {
        down: 0, // координаты мышки при нажатии. В процентах (относительно слайдера)
        up: 0, // координаты мышки при отжатии. В процентах (относительно слайдера)
        pointerDown: 0, // координаты мышки при нажатии в процентах (относительно экрана)
        pointerMove: 0, // координаты мышки при движеннии в процентах (относительно экрана)
        motionMouse: 0, // велечина сдвига элемента мышкой
        slidermove: false, // Прокрутка слайдера
        movement: 10,
      }

      /////// mouseover
      slider_wrapper.addEventListener('mouseover', () => {
        slider_wrapper.style.cursor = 'grab';
      })

      /////// mousedown
      slider.addEventListener('mousedown', (e) => {
        slider_wrapper.style.transition = '0s';
        slider_wrapper.style.cursor = 'grabbing';

        mouseHandler.slidermove = false;

        // координаты мышки при нажатии в процентах (относительно экрана)
        mouseHandler.pointerDown = Math.floor(e.clientX / document.documentElement.clientWidth * 100);

        if( e.which === 1) {
          // координаты мышки при нажатии в процентах (относительно слайдера)
          mouseHandler.down = Math.floor(mouseHandler.pointerDown) - mouseHandler.up;
        }
      });

      /////// mousemove
      slider.addEventListener('mousemove', (e) => {
        // координаты мышки при движеннии в процентах (относительно экрана)
        mouseHandler.pointerMove = Math.floor(e.clientX / document.documentElement.clientWidth * 100);

        if( e.which === 1) {
          // Выщитываем трансформацию и относительно нее двигаем слайдер
          // Внесение коррекции в трансформацию. (движение меньше на значение сдвига мышки + stepNew, который уменьшает шаг, в итоге получается ровное значение)
          transform = Math.floor(mouseHandler.pointerMove) - mouseHandler.down;

          // велечина сдвига элемента мышкой
          mouseHandler.motionMouse = Math.abs(mouseHandler.pointerDown - mouseHandler.pointerMove);

          // шаг минус сдвиг элемента мышкой, что позволяет компенсировать изменения ширины шага.
          let stepNew = step - mouseHandler.motionMouse;

          if( mouseHandler.pointerMove - mouseHandler.pointerDown > mouseHandler.movement) {
            get_transform_slider('left', stepNew);
            mouseHandler.slidermove = true;
          }
          if( mouseHandler.pointerDown - mouseHandler.pointerMove > mouseHandler.movement) {
            get_transform_slider('right', stepNew);
            mouseHandler.slidermove = true;
          }
        }

        slider_wrapper.style.transform = 'translateX(' + transform + '%)';
      })

      /////// mouseup
      slider.addEventListener('mouseup', () => {
        slider_wrapper.style.cursor = 'grab';

        mouseHandler.up = transform;

        let movement = mouseHandler.pointerDown - mouseHandler.pointerMove;

        if(  movement <= mouseHandler.movement && movement > 0 && !mouseHandler.slidermove ) {
          get_transform_slider('left', mouseHandler.motionMouse);
          mouseHandler.up += mouseHandler.motionMouse;
        }

        if( movement >= -mouseHandler.movement && movement < 0 && !mouseHandler.slidermove ) {
          get_transform_slider('right', mouseHandler.motionMouse);
          mouseHandler.up -= mouseHandler.motionMouse;
        }

      })
    }
    sliderMouseMove();

  }
}())

const slider = get_slider('.slider');
