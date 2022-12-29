import aminokwasy from './data/aminokwasy.json';

export default class BioInformatyka{
    dataString: string              // Non moduled input
    foudedRna: Array<String> = []   // output from 'readRNA' function

    constructor(_data: string = ""){
        this.dataString = _data;
    }

    setData(_data: string){         // Set data
        this.dataString = _data;
        this.readRNA()              // force 'readRNA'
    }

    readRNA(){      // Get RNA from a data 
        const RegExp = /(AUG)((?!AUG)[AUGC]{3})*?(U(A(A|G)|GA))/gm;     // Set RegExp
        this.foudedRna = this.dataString.match(RegExp) as Array<string>;
    }

    getAmin(){
        console.log(aminokwasy);
    }
}
