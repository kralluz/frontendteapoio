import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Avatar, Row, Col, Typography, Spin, message, Tag, Divider } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
// import { professionalService } from '../../services/professionalService'; // Assuming this service exists

const { Title, Text, Paragraph } = Typography;

// Mock data until the service is implemented
interface ProfessionalProfileData {
  id: string;
  name: string;
  email: string;
  specialty: string;
  crp: string;
  phone: string;
  bio: string;
  avatarUrl?: string;
}

const ProfessionalProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ProfessionalProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // const data = await professionalService.getById(id); // TODO: Uncomment when service is available
        // Mocking data for now
        const mockData: ProfessionalProfileData = {
          id,
          name: 'Dr. João da Silva',
          email: 'joao.silva@example.com',
          specialty: 'Psicólogo Infantil',
          crp: 'CRP/SP 123456',
          phone: '(11) 99999-8888',
          bio: 'Especialista em desenvolvimento infantil e transtornos do espectro autista, com mais de 10 anos de experiência em diagnóstico e intervenção precoce. Foco em abordagens lúdicas e centradas na família.',
        };
        setProfile(mockData);
      } catch (error) {
        message.error('Erro ao carregar o perfil do profissional.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Perfil não encontrado.</div>;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8} style={{ textAlign: 'center' }}>
            <Avatar size={150} src={profile.avatarUrl} icon={<UserOutlined />} style={{ border: '4px solid #1890ff' }} />
            <Title level={3} style={{ marginTop: '16px' }}>{profile.name}</Title>
            <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>{profile.specialty}</Tag>
          </Col>
          <Col xs={24} md={16}>
            <Title level={4}>Sobre</Title>
            <Paragraph style={{ textAlign: 'justify' }}>
              {profile.bio}
            </Paragraph>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Text strong><MailOutlined style={{ marginRight: 8 }} />Email:</Text>
                <br />
                <Text>{profile.email}</Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text strong><PhoneOutlined style={{ marginRight: 8 }} />Telefone:</Text>
                <br />
                <Text>{profile.phone}</Text>
              </Col>
              <Col xs={24} sm={12}>
                <Text strong><IdcardOutlined style={{ marginRight: 8 }} />Registro Profissional:</Text>
                <br />
                <Text>{profile.crp}</Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProfessionalProfile;
