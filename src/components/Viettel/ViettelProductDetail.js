import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ROUTERS } from '../../Constants';
import { Popup } from 'semantic-ui-react';
import closeIcon from '../../../public/Add.svg';
import localCss from './Viettel.css';
import { setDetailProduct } from './viettel.actions';
import VTT_CA from '../../../public/VTT_CA.png';
import VTT_BHXK from '../../../public/VTT_BHXH.png';
import VTT_HDDT from '../../../public/VTT_HDDT.png';
import VTT_TRACKING from '../../../public/VTT_TRACKING.png';
import { number } from 'card-validator';

export const ViettelProductDetail = (props) => {
  const { __DETAIL, setDetailProduct } = props;

  const numberWithCommas = (x) => {
    return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  return (
    <div style={{ width: '340px', padding: '10 16', background: '#f0f0f0' }} className={localCss.containerDetail}>
      <div className={localCss.container}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Popup
            position="top center"
            style={{ fontSize: 11 }}
            content="Đóng"
            trigger={
              <div className={localCss.iconDiv} onClick={() => setDetailProduct({})}>
                <Link to={`/${ROUTERS.VT}`}>
                  <img className={`${localCss.closeIcon} ${localCss.detailIconSize}`} src={closeIcon} />
                </Link>
              </div>
            }
          />
        </div>
        <div style={{ margin: 'auto', display: 'flex', marginTop: '20px' }}>
          {__DETAIL?.TYPE === 'ca' && <img className={localCss.imgDetail} src={VTT_CA} />}
          {__DETAIL?.TYPE === 'hddt' && <img className={localCss.imgDetail} src={VTT_HDDT} />}
          {__DETAIL?.TYPE === 'bhxh' && <img className={localCss.imgDetail} style={{ width: '60%' }} src={VTT_BHXK} />}
          {__DETAIL?.TYPE === 'tracking' && <img className={localCss.imgDetail} src={VTT_TRACKING} />}
        </div>
        {__DETAIL?.TYPE === 'ca' && (
          <table className={localCss.tableDetail}>
            {__DETAIL.connectionType && (
              <tr>
                <th>Hình thức hoà mạng</th>
                <td>{__DETAIL.connectionType}</td>
              </tr>
            )}
            {__DETAIL.customerType && (
              <tr>
                <th>Loại khách hàng</th>
                <td>{__DETAIL.customerType}</td>
              </tr>
            )}
            {__DETAIL.deviceType && (
              <tr>
                <th>Loại thiết bị</th>
                <td>{__DETAIL.deviceType}</td>
              </tr>
            )}

            {__DETAIL.productionType && (
              <tr>
                <th>Loại sản phẩm</th>
                <td>{__DETAIL.productionType}</td>
              </tr>
            )}
            {__DETAIL.productionDetail1 && (
              <tr>
                <th>Chi tiết loại SP1</th>
                <td>{__DETAIL.productionDetail1}</td>
              </tr>
            )}

            {__DETAIL.productionDetail2 && (
              <tr>
                <th>Chi tiết loại SP2</th>
                <td>{__DETAIL.productionDetail2}</td>
              </tr>
            )}
            {__DETAIL.productionDetail3 && (
              <tr>
                <th>Chi tiết loại SP3</th>
                <td>{__DETAIL.productionDetail3}</td>
              </tr>
            )}
            {__DETAIL.timeToUse && (
              <tr>
                <th>Thời gian sử dụng (tháng)</th>
                <td>{__DETAIL.timeToUse}</td>
              </tr>
            )}
            {__DETAIL.monthToUse && (
              <tr>
                <th>Thời gian sử dụng (tháng)</th>
                <td>{__DETAIL.monthToUse}</td>
              </tr>
            )}
            {__DETAIL.hthmCode && (
              <tr>
                <th>Mã HTHM</th>
                <td>{__DETAIL.hthmCode}</td>
              </tr>
            )}

            {__DETAIL.excludesVat && (
              <tr>
                <th>Đơn giá chưa VAT</th>
                <td>{numberWithCommas(__DETAIL.excludesVat)}</td>
              </tr>
            )}
            {__DETAIL.vatIncluded && (
              <tr>
                <th>Đơn giá có VAT</th>
                <td>{numberWithCommas(__DETAIL.vatIncluded)}</td>
              </tr>
            )}
          </table>
        )}
        {__DETAIL?.TYPE === 'hddt' && (
          <table className={localCss.tableDetail}>
            {__DETAIL.connectionType && (
              <tr>
                <th>Hình thức hoà mạng</th>
                <td>{__DETAIL.connectionType}</td>
              </tr>
            )}

            {__DETAIL.productionType && (
              <tr>
                <th>Loại sản phẩm</th>
                <td>{__DETAIL.productionType}</td>
              </tr>
            )}
            {__DETAIL.numberOrder && (
              <tr>
                <th>Số lượng hoá đơn</th>
                <td>{__DETAIL.numberOrder}</td>
              </tr>
            )}
            {__DETAIL.hthmCode && (
              <tr>
                <th>Mã HTHM</th>
                <td>{__DETAIL.hthmCode}</td>
              </tr>
            )}
            {__DETAIL.hthmCode && (
              <tr>
                <th>Gói hoá đơn</th>
                <td>{__DETAIL.hthmCode}</td>
              </tr>
            )}

            {__DETAIL.excludesVat && (
              <tr>
                <th>Đơn giá chưa VAT</th>
                <td>{numberWithCommas(__DETAIL.excludesVat)}</td>
              </tr>
            )}
            {__DETAIL.vatIncluded && (
              <tr>
                <th>Đơn giá có VAT</th>
                <td>{numberWithCommas(__DETAIL.vatIncluded)}</td>
              </tr>
            )}
          </table>
        )}
        {__DETAIL?.TYPE === 'bhxh' && (
          <table className={localCss.tableDetail}>
            {__DETAIL.connectionType && (
              <tr>
                <th>Hình thức hoà mạng</th>
                <td>{__DETAIL.connectionType}</td>
              </tr>
            )}
            {__DETAIL.customerType && (
              <tr>
                <th>Đối tượng</th>
                <td>{__DETAIL.customerType}</td>
              </tr>
            )}
            {__DETAIL.productionType && (
              <tr>
                <th>Loại sản phẩm</th>
                <td>{__DETAIL.productionType}</td>
              </tr>
            )}
            {__DETAIL.productionDetail1 && __DETAIL.productionDetail1 !== '' && (
              <tr>
                <th>Chi tiết loại SP1</th>
                <td>{__DETAIL.productionDetail1}</td>
              </tr>
            )}
            {__DETAIL.timeToUse && (
              <tr>
                <th>Thời gian</th>
                <td>{__DETAIL.timeToUse}</td>
              </tr>
            )}
            {__DETAIL.hthmCode && (
              <tr>
                <th>Mã HTHM</th>
                <td>{__DETAIL.hthmCode}</td>
              </tr>
            )}
            {__DETAIL.monthToUse && (
              <tr>
                <th>Thời gian sử dụng (tháng)</th>
                <td>{__DETAIL.monthToUse}</td>
              </tr>
            )}
            {__DETAIL.excludesVat && (
              <tr>
                <th>Đơn giá chưa VAT</th>
                <td>{numberWithCommas(__DETAIL.excludesVat)}</td>
              </tr>
            )}
            {__DETAIL.vatIncluded && (
              <tr>
                <th>Đơn giá có VAT</th>
                <td>{numberWithCommas(__DETAIL.vatIncluded)}</td>
              </tr>
            )}
          </table>
        )}
        {__DETAIL?.TYPE === 'tracking' && (
          <table className={localCss.tableDetail}>
            {__DETAIL.policy && (
              <tr>
                <th>Chính sách</th>
                <td>{__DETAIL.policy}</td>
              </tr>
            )}
            {__DETAIL.itemName && (
              <tr>
                <th>Mặt hàng </th>
                <td>{__DETAIL.itemName}</td>
              </tr>
            )}
            {__DETAIL.paymentMethod && (
              <tr>
                <th>Hình thức thanh toán</th>
                <td>{__DETAIL.paymentMethod}</td>
              </tr>
            )}

            {__DETAIL.monthToUse && (
              <tr>
                <th>Thời gian sử dụng (tháng)</th>
                <td>{__DETAIL.monthToUse}</td>
              </tr>
            )}

            {__DETAIL.target && (
              <tr>
                <th>Đối tượng</th>
                <td>{__DETAIL.target}</td>
              </tr>
            )}
            {__DETAIL.scope && (
              <tr>
                <th>Phạm vi áp dụng</th>
                <td>{__DETAIL.scope}</td>
              </tr>
            )}
            {__DETAIL.dataPack && (
              <tr>
                <th>Gói cước</th>
                <td>{__DETAIL.dataPack}</td>
              </tr>
            )}
            {__DETAIL.hthmCode && (
              <tr>
                <th>Mã HTHM</th>
                <td>{__DETAIL.hthmCode}</td>
              </tr>
            )}

            {__DETAIL.preConnectionFee && (
              <tr>
                <th>Phí hoà mạng cước đóng trước (gồm VAT)</th>
                <td>{numberWithCommas(__DETAIL.preConnectionFee)}</td>
              </tr>
            )}
            {__DETAIL.monthlyFee && (
              <tr>
                <th>Cước hàng tháng(VNĐ)</th>
                <td>{numberWithCommas(__DETAIL.monthlyFee)}</td>
              </tr>
            )}
            {__DETAIL.totalPreFee !== null && (
              <tr>
                <th>Tổng cước đóng trước</th>
                <td>{numberWithCommas(__DETAIL.totalPreFee)}</td>
              </tr>
            )}
            {__DETAIL.totalPrice && (
              <tr>
                <th>Tổng tiền (VNĐ)</th>
                <td>{numberWithCommas(__DETAIL.totalPrice)}</td>
              </tr>
            )}
          </table>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  __DETAIL: state.entities?.viettel?.__DETAIL,
});

const mapDispatchToProps = {
  setDetailProduct,
};

export default connect(mapStateToProps, mapDispatchToProps)(ViettelProductDetail);
