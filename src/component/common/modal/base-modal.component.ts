export class BaseModalComponent{

    protected initiated:boolean = false;

    constructor(){

    }

    protected init():void{
        this.initiated = true;
    }
}