import React from 'react';
import USBTokenTable from './USBTokenTable';
import SimHSMTable from './SimHSMTable';

const getTitle = (usb, sim, hsm) => {
    if(usb.length > 0) {
        if(sim.length > 0) {
            return ['II. THIẾT BỊ SIMCA', 'III. THIẾT BỊ HSM'];
        } else {
            return ['', 'II. THIẾT BỊ HSM'];
        }

    } else {
        if(sim.length > 0) {
            return ['I. THIẾT BỊ SIMCA', 'II. THIẾT BỊ HSM'];
        }

        return ['', 'I. THIẾT BỊ HSM'];
    }

}

const CAViewDetailQuotation = (props) => {
  const { data } = props
  const usb = data?.filter(item => item.type === 'USB TOKEN');
  const simCA = data?.filter(item => item.type === 'SIMCA');
  const hsm = data?.filter(item => item.type === 'HSM');
  console.log('9999999', usb, simCA, hsm)
    let [simCATitle, hsmTitle] = getTitle(usb, simCA, hsm);

    return (
        <>
           { usb.length > 0 && <USBTokenTable data={usb} /> }
           { simCA.length > 0 && <SimHSMTable data={simCA} title={simCATitle} /> }
           { hsm.length > 0 && <SimHSMTable data={hsm} title={hsmTitle} /> }
        </>
    )
}

export default CAViewDetailQuotation;
