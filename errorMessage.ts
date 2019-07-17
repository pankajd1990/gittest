import { Directive, ElementRef, Input, Renderer2, OnInit, AfterViewInit } from '@angular/core';
declare var $;
@Directive({ selector: '.ng-invalid',


})
export class ErrorMessageDirective implements OnInit,AfterViewInit {

    @Input() appShadow: string='red';
    @Input() appShadowX: string;
    @Input() appShadowY: string;
    @Input() appShadowBlur: string;
    @Input() loadingText: string;
    constructor(private elem: ElementRef, private renderer: Renderer2) { }

    ngOnInit() {
        //this.renderer.setStyle(this.elem.nativeElement, 'background-color', this.appShadow);
        
        //this.elem.nativeElement.prepend( "<b>Hello </b>" );
        //this.elem.nativeElement.tooltip( "option", "content", "TOOLTIP CONTENT" );        
    }

    ngAfterViewInit(){
    //     this.$matCard = this.renderer.createElement('DIV');
  
    //     this.$matCard.innerHTML='PANKAJ DURVE';
    //     const container = this.elem.nativeElement;
    //     const parent = this.elem.nativeElement.parentNode;
    //    const refChild = this.elem.nativeElement;

    //     this.renderer.createElement("DIV");
    //    this.renderer.insertBefore(parent,this.$matCard, refChild);
    
 
      
    //    this.elem.nativeElement.setAttribute('data-tooltip', 'Please provide name');
    //    this.elem.nativeElement.setAttribute('rel', 'tooltip');
      
    //   console.log(this.elem.nativeElement.getBoundingClientRect());
    let span = this.renderer.createElement('span');
    let iele = this.renderer.createElement('i');
    let pele = this.renderer.createElement('p');
    iele.setAttribute("class","fa fa-spinner fa-spin");
    pele.innerHTML=`<b>${this.loadingText}..</b>`;
    iele.style.fontSize="24px";
    span.appendChild(iele);
    span.appendChild(pele);
    this.elem.nativeElement.style.textAlign="center";
    this.elem.nativeElement.appendChild(span);



    }
}