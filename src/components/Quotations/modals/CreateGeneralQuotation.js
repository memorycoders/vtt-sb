import React, { useEffect, useState } from 'react';
import { Table, Icon, Button } from 'semantic-ui-react';
import CreateTableRowQuotation from './CreateTableRowQuotation';
import { formatNumber } from '../Utils/formatNumber';
import api from '../../../lib/apiClient';
import style from '../styles/quotations.css';
import css from '../styles/createQuotation.css';



export const CreateGeneralQuotation = (props) => {
  const type="servicePack"
  const { addServices, deleteServices, servicesData, handleSelectService, errors } = props;
  const styleDFlex = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  let servicePack = servicesData.filter(item => !item.delete);

  const handleAddService = () => {
    addServices(type);
  }

  const handleAddTable = () => {
    addServices(type);
  }

  let listServiceHasQuantity = servicesData.filter(s => !isNaN(s.priceTotal)).map(item => {
      return item.priceTotal;
  });

  let priceTotal = undefined;
  if(listServiceHasQuantity.length > 0) {
    priceTotal = listServiceHasQuantity.reduce((total, price) => total + price);
  }
    
  

  return (
    <>
      <div className={css.general_table_tilte}>
        <h4>Danh sách gói cước</h4>
        {
            servicePack.length == 0 && <Button className={css.btn_add_table} onClick={handleAddTable}>
            <Icon name="plus" />
            Thêm gói cước
          </Button>
        }
      </div>
      { errors?.isError && <p style={{color: 'red'}}> {errors?.message} </p> }
      {
        servicePack.length > 0 && <Table celled structured>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center" rowSpan="2">
                STT
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center" rowSpan="2">
                Dịch vụ
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center" rowSpan="2">
                Hình thức hoà mạng
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center" rowSpan="2">
                Tên sản phẩm
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center" rowSpan="2">
                Mã HTHM
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center" rowSpan="2">
                Số lượng
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center" colSpan="2" rowSpan="1">
                Đơn giá có VAT(VNĐ)
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center" rowSpan="2">
                Thành tiền (VNĐ)
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center" rowSpan="2"></Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell textAlign="center">Giá dịch vụ (VNĐ)</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Giá thiết bị (VNĐ)</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              servicesData.filter(item => !item.delete).map((item, index) => {
                return <CreateTableRowQuotation key={item.id} index={index} type={type} deleteServices={deleteServices} 
                          onChangeSelectedService={handleSelectService} data={item} />
              })
            }
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="8">
                <div style={styleDFlex}>
                  <Button className={style.btnSelectQuote} onClick={handleAddService}>
                    <Icon name="plus" />
                    Thêm gói cước
                  </Button>
                  <p>Tổng giá trị đơn hàng</p>
                </div>
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">{formatNumber(priceTotal)}</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      }
    </>
  );
};

export default CreateGeneralQuotation;
