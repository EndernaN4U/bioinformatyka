import acids from './data/amino_acids.json';
import acidsMass from './data/amino_acids_props.json';

function ObjKey(str: string): keyof Object{
    return str as keyof Object;
}

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
        const rdata =  _data.split('').map( e=>ObjKey(e));
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
        const aminoAcid = _aminoAcid.split('').map( e=>ObjKey(e))
        let mass = 0;  

        for(let i = 0; i < aminoAcid.length - 1; i++) {
            mass += acidsMass[aminoAcid[i]][ObjKey("Mass")] as any
        }

        mass -= (aminoAcid.length - 2) * 18.015                 // 18.015 = H2O mass
        mass = Math.round(mass * 10000) / 10000                 // round to 3 decimal places
        return mass;
    }

    calcPi(_aminoAcid : string) {
        const aminoacids = { // aminoacids with charges and respective deltas (positive / negative)
            'D':{ "delta": -1, "charge": 3.9   },
            'E':{ "delta": -1, "charge": 4.07  },
            'C':{ "delta": -1, "charge": 8.18  },
            'Y':{ "delta": -1, "charge": 10.46 },
            'H':{ "delta":  1, "charge": 6.04  },
            'K':{ "delta":  1, "charge": 10.54 },
            'R':{ "delta":  1, "charge": 12.48 }
        }
        let amounts = new Map<string, number>();
        for (let aminoacid of _aminoAcid ) { // iterates over protein, counts aminoacids with charges
            if ( aminoacids[ObjKey(aminoacid)] !== undefined ) {
                 amounts.set(aminoacid,(amounts.has(aminoacid)? amounts.get(aminoacid)! + 1 : 1))
            }  
        }
    
        let pH = 0
        while ( true ) { 
            let NQ = 0 // initializes the  n-terminus charge
            for ( let [key,amino] of Object.entries(aminoacids) ) {
                NQ+= amino.delta * amounts.get(key)! / (1+Math.pow(10, amino.delta * (pH - amino.charge)));           
            } 
    
            NQ+= -1/(1+Math.pow(10,(3.65-pH))); //these are constants, we can compute it beforehand btw
            NQ+= 1/(1+Math.pow(10,(pH-8.2)));                
    
            if (pH>=14.0) {
                console.log("somethings fucked")
                break;    
            }                                                 
    
            if (NQ<=0) {
                return +pH.toFixed(2);
            }
    
            pH+=0.01;
        }
    }
}