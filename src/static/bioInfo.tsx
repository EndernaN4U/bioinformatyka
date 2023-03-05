import acids from './data/amino_acids.json';
import aminoProps from './data/amino_acids_props.json';
import aminoDrawingData from './aminoDrawingData/aminoDrawingData.json';

function ObjKey(str: string): keyof Object{
    return str as keyof Object;
}

export default class BioInformatyka{
    dataString: string              // Non moduled input

    data: Array<Object>

    constructor(_data: string = ""){
        this.dataString = _data; this.data = [];
    }

    dnaToRna(_data: string){        // Change thymine to uracil
        return _data.replaceAll('T','U');
    }

    setData(_data: string){         // Set data
        this.dataString = _data;
        this.readRNA();             // force 'readRNA'
    }

    readRNA(){      // Get RNA from a data 
        const RegExp = /(AUG)((?!AUG)[AUGC]{3})*?(U(A(A|G)|GA))/gm;     // get a sequence which starts at string "AUG" and contains any number of triplets consisting of letters "A", "U", "G", "C" and that ends with any of the specified end codons.
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
            mass : this.calcMass(amounts),
            longSequence : this.getLongSequence(_aminoAcid),
            gravy: this.calcGravy(amounts),
            netCharge: this.calcNetCharge(amounts),
            isoelectricPoint: this.calcIsoelectricPoint(amounts),
            svg: this.drawSVG(_aminoAcid)
        }
        
        return props
    }

    getLongSequence(_aminoAcid : string) {
        let longSequence = '';
        for (let amino of _aminoAcid) {
            longSequence += aminoProps[ObjKey(amino)][ObjKey("Symbol")] as any + " - ";
        }
        return "NH2 - " + longSequence + "OOOH" // a small hack to remove trailing "- "
    }

    calcNetCharge( amounts: Map<string, number> ) {
        // source: https://en.wikipedia.org/wiki/Henderson%E2%80%93Hasselbalch_equation
        let pH = 7
        let netCharge = 0 // initializes the  n-terminus charge
        for ( let [key,amount] of amounts ) {
            const delta =  aminoProps[ObjKey(key)][ObjKey("delta")] as any;
            const charge = aminoProps[ObjKey(key)][ObjKey("charge")] as any;

            if(charge && delta) netCharge += delta * amount / (1+Math.pow(10, delta * (pH - charge)));        
        } 

        netCharge += -1/(1+Math.pow(10,(3.65-pH))); // include isoelectricity of the side chains 
        netCharge += 1/(1+Math.pow(10,(pH-8.2)));                
    
        return netCharge.toFixed(3);
    }


    calcIsoelectricPoint(amounts: Map<string,number>) {
        // isoelectric point is a value of the pH at which a molecule carries no net electrical charge
        let pH = 0
        while ( true ) { 
            let NQ = 0 // net charge
            for ( let [key,amount] of amounts ) {
                const delta =  aminoProps[ObjKey(key)][ObjKey("delta")] as any;
                const charge = aminoProps[ObjKey(key)][ObjKey("charge")] as any;

                if(charge && delta) NQ+= delta * amount / (1+Math.pow(10, delta * (pH - charge))); // little modified equation, mathematically identical.
            } 
    
            NQ += -1/(1+Math.pow(10,(3.65-pH))); // include isoelectricity of the side chains 
            NQ += 1/(1+Math.pow(10,(pH-8.2)));                
    
            if ( pH>=14.0 ) {
                // if Ph crossed 14, then something went wrong.
                break;    
            }                                                 
    
            if ( NQ<=0 ) {
                return pH.toFixed(3);
            }
    
            pH+=0.01;
        }
        return null;
    }

    calcMass( amounts: Map<string, number> ) {
        //peptide mass is calculated by adding mass of every amino acid in the sequence.
        let peptideMass = 0
        let amountOfAminoacids = 0;
        const H20Mass = 18.015;
        for (let [amino , amount] of amounts) {
            const aminoMass = aminoProps[ObjKey(amino)][ObjKey("Mass")] as any;
            peptideMass += amount * aminoMass;    
            amountOfAminoacids += amount;
        }
        peptideMass -= (amountOfAminoacids-1) * H20Mass;

        return peptideMass.toFixed(3);
    }

    calcGravy( amounts: Map<string, number> ) {
        // GRAVY is calculated by adding hydropathy values of every aminoacid in the protein and then dividing it by the number of aminoacids
        let gravy = 0, amountOfAminoacids = 0;
        for (let [amino , amount] of amounts) {
            const hydropathy = aminoProps[ObjKey(amino)][ObjKey("hydropathy")] as any;
            gravy += amount * hydropathy;    
            amountOfAminoacids += amount;
        }
        gravy /= amountOfAminoacids;
        return gravy.toFixed(3);
    }

    


    drawSVG(_aminoAcid : string) {
        //TODO: change magic numbers to fields in aminoDrawingData

        let offset = -aminoDrawingData.connectorOffset
        let oxygen = true
        let connector = true
        let amino = true
        let transform = ''

        return(
          <div style={{ width: 'calc(100% - 10px)', transform: 'translate(10px)' }}>
          <img src={aminoDrawingData.M.image}></img>
          {
            _aminoAcid.split("").map((el, i) => {
                const offsetCopy = offset
                
                if (_aminoAcid[i - 1] == 'A' || _aminoAcid[i - 1] == 'G') {
                    connector = !connector
                    oxygen = connector
                }

                if (el != 'M') {
                    connector = !connector
                    oxygen = connector
                    amino = !amino
                }
                
                // long amino acids
                if (el == 'A' || el == 'G') {
                    amino = !amino
                    offset += aminoDrawingData.longAminoOffset + aminoDrawingData.connectorOffset
                    oxygen = !connector
                }
                
                // casual case
                else {
                    offset += aminoDrawingData.aminoOffset + aminoDrawingData.connectorOffset
                } 

                // translates for correct aligning amino acids
                if(el == 'T' || el == 'V') transform = "translate(-24.071px)"
                else if(el == 'Q' || el == 'E')  transform = "translate(-11.374px)"
                else if(el == 'P')  transform = "translate(-36px)"
                else if(el == 'W')  transform = "translate(-18.916px)"
                else if(el == 'I')  transform = "translate(-26.296px)"
                else transform = '0'
                
                return(
                    i == 0 ? '' :  
                    <>
                    {
                        <>
                        {
                            el == 'P' ?
                                !connector ? 
                                <img src={aminoDrawingData.prolineConnector.image} style={{position: 'absolute', left: `${offsetCopy}px`}}></img>
                                :
                                <img src={aminoDrawingData.prolineConnector.flippedImage} style={{position: 'absolute', left: `${offsetCopy}px`}}></img>
                            :
                            !connector ? 
                            <img src={aminoDrawingData.connector.image} style={{position: 'absolute', left: `${offsetCopy}px`}}></img>
                            :
                            <img src={aminoDrawingData.connector.flippedImage} style={{position: 'absolute', left: `${offsetCopy}px`}}></img>
                        }
                        </>
                    }
                    {
                        amino ? 
                        <>{<img src={aminoDrawingData[ObjKey(el)][ObjKey('image')] as any} style={{ position:'absolute', left: `${offsetCopy + aminoDrawingData.connectorOffset}px`, transform: transform}}></img>}</>
                        :
                        <>{<img src={aminoDrawingData[ObjKey(el)][ObjKey('flippedImage')] as any} style={{ position:'absolute', left: `${offsetCopy + aminoDrawingData.connectorOffset}px`, transform: transform}}></img>}</>
                    }
                    </>
                )  
            })
          }
          {
            oxygen ?
            <img src={aminoDrawingData.oxygen.image} style={{ position:'absolute', left: `${offset}px`}}/>
            :
            <img src={aminoDrawingData.oxygen.flippedImage} style={{position: 'absolute', left: `${offset}px`}}/>
          }
          </div>
        )
    }
}
