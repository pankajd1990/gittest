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
            var str='';
            str +=`<p>${this.elRef.nativeElement.innerHTML}</p>`;
       
            var elem = document.createElement('div');                        
            var elemP = document.createElement('p');         
            elem.setAttribute('class','tooltip1');
            var elem1 = document.createElement('div');
            elem1.setAttribute('class','arrow');           
            elem.style.position="absolute";
            
            elem.style.zIndex="1";
            elem.style.backgroundColor="white";         
            elem.style.border="2px solid red";
            elem.style.width="500px";

            elem.appendChild(elemP); 
            elem.appendChild(elem1);
            document.body.appendChild(elem);
        }
     

        var divToolTip =   document.querySelector(".tooltip1") as HTMLElement;      
        let sourceControl=this.elRef.nativeElement.getBoundingClientRect();
       let scrcor= this.GetScreenCordinates(this.elRef.nativeElement);  
       
       var bodyRect = document.body.getBoundingClientRect();
       console.log(bodyRect);
      
       let topoffset   = sourceControl.top +window.scrollY;
       document.querySelector(".tooltip1 p").innerHTML=this.elRef.nativeElement.innerHTML;




       // var top = pos.top+30;
        divToolTip.style.top = (topoffset+40)+'px';
        divToolTip.style.left= sourceControl.left+"px";

        
        var tooltip_rect = divToolTip.getBoundingClientRect();              
        if($(divToolTip).offset().left + $(divToolTip).outerWidth() > window.innerWidth) {   
            var diff= ($(divToolTip).offset().left + $(divToolTip).outerWidth()) - window.innerWidth;  
            //alert(diff);    
            divToolTip.style.left=$(divToolTip).offset().left-diff-10+"px";
        }

        let diff1=sourceControl.left-$(divToolTip).offset().left; 
       
        
        // $(".arrow").attr('data-left','100px');
                 
        document.documentElement.style.setProperty('--arrow-after', diff1+'px') ;
        document.documentElement.style.setProperty('--arrow-before', diff1-6+'px') ;

    }
 
    @HostListener('mouseleave') onMouseLeave() {  
        // if (document.querySelector('.tooltip1') != null) {          
        //     var elem=  document.querySelector('.tooltip1');
        //   document.body.removeChild(elem);
        // }

    }


    GetScreenCordinates(obj) {
        var p = {x:'',y:''};
        p.x = obj.offsetLeft;
        p.y = obj.offsetTop;
        while (obj.offsetParent) {
            p.x = p.x + obj.offsetParent.offsetLeft;
            p.y = p.y + obj.offsetParent.offsetTop;
            if (obj == document.getElementsByTagName("body")[0]) {
                break;
            }
            else {
                obj = obj.offsetParent;
            }
        }
        return p;
    }


}