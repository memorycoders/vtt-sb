import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { TYPE_SERVICE } from './Constants';
import CommonViewDetailTable from './CommonViewDetailQuotation';
import CAViewDetailQuotation from './CAViewDetailQuotation';
import ElectricInvoiceDetailQuotation from './ElectricInvoiceDetailQuotation';
import InsurranceDetailQuotation from './InsurranceDetailQuotation';
import ModalCommon from '../ModalCommon/ModalCommon';
import BasicInfo from './components/BasicInfo';
import css from './styles/quotationDetail.css';

const QuotationDetail = (props) => {
    const { open, handleClose, typeService, detail } = props;
    const quotationInfo = detail?.organisationDTO;
    // console.log('user data is coming to town =>', detail)
    let component = null;
    const basicInfo = {
        nameQuotation: quotationInfo?.name,
        nameCustomer: quotationInfo?.customer,
        taxCode: quotationInfo?.code,
        address: quotationInfo?.address,
        email: quotationInfo?.email,
        am: quotationInfo?.am
    }
    switch (typeService) {
        case TYPE_SERVICE.NONE:
            component = <CommonViewDetailTable data={detail?.quotationDetailTypeDTOS} />;
            break;
        case TYPE_SERVICE.CA:
            component = <CAViewDetailQuotation data={detail?.quotationDetailTypeDTOS} />;
            break;
        case TYPE_SERVICE.HDDT:
            component = <ElectricInvoiceDetailQuotation data={detail?.quotationDetailTypeDTOS} />;
            break;
        case TYPE_SERVICE.VBHXH:
            component = <InsurranceDetailQuotation data={detail?.quotationDetailTypeDTOS} />;
            break;
        // case TYPE_SERVICE.vTracking:
        //     component = null; //chưa làm để phase sau
        //     break;
        default:
            break;
    }

    const handleDone = () => { }

    // return (
    //     <Modal open={open} closeIcon onClose={handleClose} >
    //         <Modal.Header className={css.modal_header}>
    //             Xem chi tiết báo giá
    //         </Modal.Header>
    //         <Modal.Content scrolling>
    //             <BasicInfo isViewOnly={true} data={basicInfo} />
    //             <div className={css.list_services}>
    //                 { component }
    //             </div>
    //         </Modal.Content>
    //         <Modal.Actions>
    //             <Button onClick={handleClose} className={css.close_btn}>Đóng</Button>
    //         </Modal.Actions>
    //     </Modal>
    // )

    return (
        <ModalCommon title="Xem chi tiết báo giá" noLabel="Đóng" visible={open} onClose={handleClose} onDone={handleDone} okHidden={true} >
            <BasicInfo isViewOnly={true} data={basicInfo} />
            <div className={css.list_services}>
                {component}
            </div>
        </ModalCommon>
    )
}

export default QuotationDetail;
