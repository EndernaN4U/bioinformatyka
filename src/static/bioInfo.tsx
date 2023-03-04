import acids from './data/amino_acids.json';
import aminoProps from './data/amino_acids_props.json';
import A from './svg/A.svg'
import Af from './svg/Af.svg'
import C from './svg/C.svg'
import Cf from './svg/Cf.svg'
import D from './svg/D.svg'
import Df from './svg/Df.svg'
import E from './svg/E.svg'
import Ef from './svg/Ef.svg'
import F from './svg/F.svg'
import Ff from './svg/Ff.svg'
import G from './svg/G.svg'
import Gf from './svg/Gf.svg'
import H from './svg/H.svg'
import Hf from './svg/Hf.svg'
import I from './svg/I.svg'
import If from './svg/If.svg'
import K from './svg/K.svg'
import Kf from './svg/Kf.svg'
import L from './svg/L.svg'
import Lf from './svg/Lf.svg'
import M from './svg/M.svg'
import N from './svg/N.svg'
import Nf from './svg/Nf.svg'
import P from './svg/P.svg'
import Pf from './svg/Pf.svg'
import Q from './svg/Q.svg'
import Qf from './svg/Qf.svg'
import R from './svg/R.svg'
import Rf from './svg/Rf.svg'
import S from './svg/S.svg'
import Sf from './svg/Sf.svg'
import T from './svg/T.svg'
import Tf from './svg/Tf.svg'
import V from './svg/V.svg'
import Vf from './svg/Vf.svg'
import W from './svg/W.svg'
import Wf from './svg/Wf.svg'
import Y from './svg/Y.svg'
import Yf from './svg/Yf.svg'
import Connector from './svg/connector.svg'
import Connectorf from './svg/connectorf.svg'
import ProlineConnector from './svg/proline connector.svg'
import ProlineConnectorf from './svg/proline connectorf.svg'
import Oxygen from './svg/oxygen.svg'
import Oxygenf from './svg/oxygenf.svg'

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

        this.data = [];
        
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

        let amounts = new Map<string, number>();
        for (let aminoacid of _aminoAcid ) { // iterates over protein, counts aminoacids with charges
            if ( aminoProps[ObjKey(aminoacid)] !== undefined ) {
                 amounts.set(aminoacid,(amounts.has(aminoacid)? amounts.get(aminoacid)! + 1 : 1))
            }  
        }

        let props = {
            length: _aminoAcid.length,
            mass : this.calcMass(_aminoAcid),
            gravy: this.calcGravy(amounts),
            pi: this.calcPi(amounts),
            svg: this.drawSVG(_aminoAcid)
        }
        
        return props
    }

    calcMass(_aminoAcid: string){
        const aminoAcid = _aminoAcid.split('').map( e=>ObjKey(e))
        let mass = 0;  

        for(let i = 0; i < aminoAcid.length; i++) {
            mass += aminoProps[aminoAcid[i]][ObjKey("Mass")] as any
        }

        mass -= (aminoAcid.length - 1) * 18.015                 // 18.015 = H2O mass
        mass = Math.round(mass * 10000) / 10000                 // round to 3 decimal places
        return mass;
    }

    calcGravy( amounts: Map<string, number> ) {
        // gravy is calculated by adding hydropathy values of every aminoacid in the protein and then dividing it by the number of aminoacids
        let gravy = 0, am = 0;
        console.log(amounts)
        for (let [key, value] of amounts) {
            const hydropathy = aminoProps[ObjKey(key)][ObjKey("hydropathy")] as any;
            gravy += value * hydropathy;    
            am += 1;
        }
        gravy /= am // if we decide to serialize that, we should also make a field with the total number of aminoacids in the sequence (lenght)
        return gravy.toFixed(3)
    }

    

    calcPi(amounts: Map<string,number>) {
    
        let pH = 0
        while ( true ) { 
            let NQ = 0 // initializes the  n-terminus charge
            for ( let [key,amount] of amounts ) {
                const delta =  aminoProps[ObjKey(key)][ObjKey("delta")] as any;
                const charge = aminoProps[ObjKey(key)][ObjKey("charge")] as any;
                if(charge && delta) NQ+= delta * amount / (1+Math.pow(10, delta * (pH - charge)));        
            } 
    
            NQ+= -1/(1+Math.pow(10,(3.65-pH))); //these are constants, we can compute it beforehand btw
            NQ+= 1/(1+Math.pow(10,(pH-8.2)));                
    
            if (pH>=14.0) {
                console.log("Ph crossed 14.");
                break;    
            }                                                 
    
            if (NQ<=0) {
                return +pH.toFixed(2);
            }
    
            pH+=0.01;
        }
        return null;
    }

    drawSVG(_aminoAcid : string) {

        const svg = {
            A: { pattern: A, flippedPattern: Af },
            C: { pattern: C, flippedPattern: Cf},
            D: { pattern: D, flippedPattern: Df },
            E: { pattern: E, flippedPattern: Ef },
            F: { pattern: F, flippedPattern: Ff },
            G: { pattern: G, flippedPattern: Gf }, 
            H: { pattern: H, flippedPattern: Hf }, 
            I: { pattern: I, flippedPattern: If }, 
            K: { pattern: K, flippedPattern: Kf }, 
            L: { pattern: L, flippedPattern: Lf }, 
            M: M, 
            N: { pattern: N, flippedPattern: Nf }, 
            P: { pattern: P, flippedPattern: Pf }, 
            Q: { pattern: Q, flippedPattern: Qf }, 
            R: { pattern: R, flippedPattern: Rf }, 
            S: { pattern: S, flippedPattern: Sf }, 
            T: { pattern: T, flippedPattern: Tf }, 
            V: { pattern: V, flippedPattern: Vf }, 
            W: { pattern: W, flippedPattern: Wf }, 
            Y: { pattern: Y, flippedPattern: Yf },          

            connector: Connector,
            connectorf: Connectorf,
            prolineConnector: ProlineConnector,
            prolineConnectorf: ProlineConnectorf,
            oxygen: Oxygen,
            oxygenf: Oxygenf
        }

        let translate = 0
        let connector = true
        let amino = false
        let transform = ''

        

        return(
          <div style={{ transform: 'translate(10px)' }}>
          <img src={svg.M}></img>
          {
            _aminoAcid.split("").map((el, i) => {
                const translateCopy = translate
                amino = !amino
                
                console.log(el)
                
                if (el != 'M') connector = !connector
                if (_aminoAcid[i - 1] == 'A' || _aminoAcid[i - 1] == 'G') connector = !connector
                if (el == 'A' || el == 'G') {
                    amino = !amino
                    translate += 72.964 + 35.777
                }
                else {
                    translate += 48.591 + 35.777
                } 

                // translates for correct aligning amino acids
                if(el == 'T') transform = "translate(-24.071px)"
                else if(el == 'P')  transform = "translate(-36px)"
                else if(el == 'Q')  transform = "translate(-11.374px)"
                else if(el == 'V')  transform = "translate(-24.071px)"
                else if(el == 'W')  transform = "translate(-18.916px)"
                else if(el == 'I')  transform = "translate(-26.296px)"
                else transform = '0'

                console.log(el)
                
                return(
                    i == 0 ? '' :  
                    <>
                    {
                        <>
                        {
                            el == 'P' ?
                                !connector ? 
                                <img src={svg.prolineConnector} style={{ position: 'absolute', left: `${translateCopy - 35.777}px` }}></img>
                                :
                                <img src={svg.prolineConnectorf} style={{ position: 'absolute', left: `${translateCopy - 35.777}px` }}></img>
                            :
                            !connector ? 
                            <img src={svg.connector} style={{ position: 'absolute', left: `${translateCopy - 35.777}px` }}></img>
                            :
                            <img src={svg.connectorf} style={{ position: 'absolute', left: `${translateCopy - 35.777}px` }}></img>
                            
                        }
                        </>
                    }
                    {
                        amino ? 
                        <>{<img src={svg[ObjKey(el)][ObjKey('pattern')] as any} style={{ position: 'absolute', left: `${translateCopy}px`, transform: transform }}></img>}</>
                        :
                        <>{<img src={svg[ObjKey(el)][ObjKey('flippedPattern')] as any} style={{ position: 'absolute', left: `${translateCopy}px`, transform: transform }}></img>}</>
                    }
                    </>
                )  
            })
          }
          {
            !connector ?
            <img src={svg.oxygen} style={{ position: 'absolute', left: `${translate - 35.777}px` }}/>
            :
            <img src={svg.oxygenf} style={{ position: 'absolute', left: `${translate - 35.777}px` }}/>
          }
          </div>
        )
    }
}
