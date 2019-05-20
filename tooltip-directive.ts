import { Directive, HostListener, Renderer, ElementRef } from '@angular/core';
declare var $;
// Directive decorator
@Directive({ selector: '[myTooltip]' })
// Directive class
export class TooltipDirective {
    constructor(el: ElementRef, renderer: Renderer,private elRef:ElementRef) {
     // Use renderer to render the element with styles
      // renderer.setElementStyle(el.nativeElement, 'background-color', 'red');
    }

    @HostListener('mouseenter') onMouseEnter($event) {
        if (document.querySelector('.tooltip1') == null) {
            var elem = document.createElement('div');
            elem.setAttribute('class','tooltip1');
            elem.style.position="absolute";
            elem.style.zIndex="10000";
            elem.style.border="2px solid red";
            elem.style.width="100px";
            elem.innerHTML="PANKAJ DURVE PANVEL";
            document.body.appendChild(elem);
        }
        var divToolTip =   document.querySelector(".tooltip1") as HTMLElement;
        console.log(divToolTip);
        let sourceControl=this.elRef.nativeElement;
        console.log(sourceControl);
       // var top = pos.top+30;
        divToolTip.style.top =sourceControl.offsetTop+20+'px';
        divToolTip.style.left= '12px';

       

    }

    @HostListener('mouseleave') onMouseLeave() {
        console.log("mouse leave");
        if (document.querySelector('.tooltip1') != null) {
            console.log(elem);
           var elem=  document.querySelector('.tooltip1');
            document.body.removeChild(elem);
        }

    }

}