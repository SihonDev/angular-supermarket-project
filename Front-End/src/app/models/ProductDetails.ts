export class ProductDetails{
    public constructor(
        public id?:number,
        public productName?:string,
        public categoryId?:number,
        public price?:number,
        public pictureRoute?:string,
        public file?:File
    ){}

}