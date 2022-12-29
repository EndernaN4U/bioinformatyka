import { AriaAttributes } from 'react';
import acids from './data/amino_acids.json';

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

    codonsIntoAcids(_data: string){     //Get string of acids from data
        let acids = "";
        const data = _data.match(/.{3}/gm) ?? [];
        data.forEach( (el)=>{
            acids += this.codonIntoAcid(el);
        })
        return acids;
    }

    codonIntoAcid(_data: string){       // Get Acid value from codon
        const rdata =  _data.split('').map( e=>e as keyof Object);
        return acids[rdata[0]][rdata[1]][rdata[2]];
    }

    getAcids(){     // returns Acids from json file
        return acids;
    }
}
