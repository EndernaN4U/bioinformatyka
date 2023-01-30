import acids from './data/amino_acids.json';
import acidsMass from './data/amino_acids_mass.json'

export default class BioInformatyka{
    dataString: string              // Non moduled input

    data: Array<Object>

    constructor(_data: string = ""){
        this.dataString = _data;
        this.data = [];
    }

    dnaToRna(_data: string){        // Change thymine to uracil
        return _data.replaceAll('T','U');
    }

    setData(_data: string){         // Set data
        this.dataString = _data;
        this.readRNA();             // force 'readRNA'
    }

    readRNA(){      // Get RNA from a data 
        const RegExp = /(AUG)((?!AUG)[AUGC]{3})*?(U(A(A|G)|GA))/gm;     // Set RegExp
        const foudedRna = this.dataString.match(RegExp) as Array<string>;

        foudedRna.forEach((rna: String)=>{
            const acid = this.codonsIntoAcids(rna as string);
            this.data.push({aminoAcid: acid, rna: rna});
        })
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
    
    getProperties(_aminoAcid: string){
        let props = []
        props.push(_aminoAcid.length)                           // length
        props.push(this.calculateMass(_aminoAcid))              // protein mass
        return props
    }

    calculateMass(_aminoAcid: string){
        const aminoAcid = _aminoAcid.split('').map( e=>e as keyof Object)
        let mass = 0;  

        for(let i = 0; i < aminoAcid.length - 1; i++) {
            mass += acidsMass[aminoAcid[i]]["Mass" as keyof Object] as any
        }

        mass -= (aminoAcid.length - 2) * 18.015                 // 18.015 = H2O mass
        mass = Math.round(mass * 10000) / 10000                 // round to 3 decimal places
        return mass;
    }
}
