import React, { useState, useEffect } from 'react';
import ModalCommon from '../ModalCommon/ModalCommon';
import api from '../../lib/apiClient';
import { saveAs } from 'file-saver';


const QuotationPreviewPDF = (props) => {
    const {visible, onClose, quotation} = props;
    const [file, setFile] = useState(undefined);
    let uuid = quotation?.uuid;
    let name = quotation?.name;
    useEffect(() => {
      loadFile();
    }, [])

    const loadFile = async () => {
      try {
        const res = await api.get({
          resource: `/quotation-v3.0/quotation/report/${uuid}`,
          query: {
            type: "pdf",
          },
          options: {
            responseType: 'blob',
          }
        });
        if(res) {
          let blob  = res.slice(0, res.size, 'application/pdf');
          let reader = new FileReader();
          reader.onloadend = function() {
              var base64data = reader.result;
              setFile(base64data);
          }
          reader.readAsDataURL(blob);
        }
      } catch(err) {
        console.log('error: ', err);
      }
    }

    const handleExport = async () => {
      saveAs(file, `${name}.pdf`);
    }

    return (
        <ModalCommon title={`Xem trước báo giá`} visible={visible} onClose={onClose} onDone={handleExport} okLabel="Tải xuống" noLabel="Đóng" okHidden={file ? false : true}>
            <div>
                {file && <embed src={file} height="800px" width="100%" type="application/pdf" /> }
            </div>
        </ModalCommon>
    )
}

export default QuotationPreviewPDF;
