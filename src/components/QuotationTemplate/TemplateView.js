import React, { useState, useEffect } from 'react';
import _l from 'lib/i18n';
import css from './styles/templateView.css';
import NoResults from '../NoResults/NoResults';
import ModalCommon from '../ModalCommon/ModalCommon';
import api from '../../lib/apiClient';

const TemplateView = (props) => {
    const {open, onClose, template} = props;
    const { name, uuid } = template;
    const [image, setImage] = useState(undefined);

    const onDone = () => {}

    let nameTemplate = {
        NONE: "chung",
        HDDT: "hoá đơn điện tử",
        XBHXH: "bảo hiểm xã hội",
        CA1: "CA"
    }

    const fetchImage = async (templateUUID) => {
        try {
          let res = await api.get({
            resource: `quotation-v3.0/quotation/template`,
            query: {
                templateUUID: templateUUID,
                type: 'image'
            },
            options: {
              responseType: 'blob',
            }
          });
          if(res) {
            let reader = new FileReader();
            reader.readAsDataURL(res);
            reader.onloadend = function() {
                let base64data = reader.result;
                setImage(base64data);
            }
          }

        } catch (err) {
          console.log('Error ->', err.message)
        }
      }

    useEffect(() => {
      fetchImage(uuid);
    }, [])

    return (
        <ModalCommon title={`Mẫu báo giá ${nameTemplate[name]}`} visible={open} onClose={onClose} onDone={onDone} noLabel="Đóng" okHidden={true} >
            <div>
              { image && <img src={image} style={{ width: '100%' }}/> }
            </div>
        </ModalCommon>
    )
}

export default TemplateView;
