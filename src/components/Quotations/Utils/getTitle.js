export const getCATitle = (usb, sim ) => {
    if(usb !== null && usb.length > 0) {
        if(sim !== null && sim.length > 0) {
            return ['II. THIẾT BỊ SIMCA', 'III. THIẾT BỊ HSM'];
        } else {
            return ['', 'II. THIẾT BỊ HSM'];
        }
    } else {
        if(sim !== null && sim.length > 0) {
            return ['I. THIẾT BỊ SIMCA', 'II. THIẾT BỊ HSM'];
        }
        return ['', 'I. THIẾT BỊ HSM'];
    }
}

export const getElectricInvoiceTitle = (listServicePack, costs) => {
    if(listServicePack !== null && listServicePack.length > 0) {
        if(costs !== null && costs.length > 0) {
            return ['II. CÁC LOẠI PHÍ', 'III. DỊCH VỤ CHỮ KÝ SỐ HSM ĐỂ KÝ HDDT'];
        } else {
            return ['', 'II. DỊCH VỤ CHỮ KÝ SỐ HSM ĐỂ KÝ HDDT'];
        }
    } else {
        if(costs !== null && costs.length > 0) {
            return ['I. CÁC LOẠI PHÍ', 'II. DỊCH VỤ CHỮ KÝ SỐ HSM ĐỂ KÝ HDDT'];
        }
        return ['', 'I. DỊCH VỤ CHỮ KÝ SỐ HSM ĐỂ KÝ HDDT'];
    }
}