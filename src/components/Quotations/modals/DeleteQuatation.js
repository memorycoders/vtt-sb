import React from 'react';
import _l from 'lib/i18n';
import { connect } from 'react-redux';
import ModalCommon from '../../ModalCommon/ModalCommon';
import api from '../../../lib/apiClient';
import * as NotificationActions from 'components/Notification/notification.actions';
import { deleteQuotationSuccess } from '../quotation.action';



const DeleteQuotation = ({ visible, onClose, uuid , notiSuccess, notiError, deleteQuotationSuccess}) => {
  
  const onSave = async () => {
    try {
      const rs = await api.post({
        resource: `quotation-v3.0/quotation/${uuid}`,
      });
      if (rs) {
        deleteQuotationSuccess({uuid});
        notiSuccess(_l`Deleted`, '', 2000);
        onClose();
      } else {
        notiError('Đã có lỗi xảy ra', '', 2000);
      }
    } catch (error) {
      return notiError(error.message, '', 2000);
    }
  }

  return (
    <ModalCommon title={_l`Confirm`} visible={visible} onDone={onSave} onClose={onClose} size="tiny"
      paddingAsHeader={true} okLabel="Có" noLabel="Không">
      <p>Bạn có chắc chắn muốn  xóa báo giá này không?</p>
    </ModalCommon>
  );
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = {
  notiSuccess: NotificationActions.success,
  notiError: NotificationActions.error,
  deleteQuotationSuccess: deleteQuotationSuccess
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteQuotation)
