import React from 'react';
import { Row, Col, Card } from 'antd';
import { Link } from 'react-router-dom';

const ImagesProfile = () => {

  return (
    <Row gutter={18}>
      <Col span={12}>
      <Card style={{ width: '100%', height: 320 }}>
        <p style={{fontSize:'20px', fontWeight:'bold'}}>Tạo album</p>
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         
         <Link to="/trip/create-album">
         <img src="https://i.pinimg.com/236x/35/7d/18/357d180030aee6733df1cad03af266c2.jpg" alt="Image 1"  />
         </Link>
           
          </div>
        </Card>
      </Col>
      <Col span={12}>
        <Card style={{ width: '100%', height: 320 }}>
        <p style={{fontSize:'20px', fontWeight:'bold'}}>Ảnh đại diện</p>
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           
          <Link to="/trip/sh-avatar">
          <img src="https://i.pinimg.com/236x/e8/c7/66/e8c766c390127da489d7cf9358c1f93e.jpg" alt="Image 2"  />
          </Link>
          </div>
        </Card>
      </Col>
    </Row>
  );
}

export default ImagesProfile;