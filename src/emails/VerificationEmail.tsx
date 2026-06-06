import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
  } from '@react-email/components'
  
  interface VerificationEmailProps {
    name: string
    verificationUrl: string
  }
  
  export function VerificationEmail({ name, verificationUrl }: VerificationEmailProps) {
    const firstName = name.split(' ')[0]
  
    return (
      <Html lang="ru">
        <Head />
        <Preview>Подтвердите ваш email адрес на Sferus</Preview>
        <Body style={main}>
          <Container style={container}>
            {/* Логотип / название */}
            <Section style={logoSection}>
              <Text style={logo}>sferus</Text>
            </Section>
  
            <Section style={content}>
              <Heading style={heading}>Подтвердите email</Heading>
  
              <Text style={paragraph}>Привет, {firstName}!</Text>
              <Text style={paragraph}>
                Вы зарегистрировались на Sferus — платформе для поиска специалистов
                в Приднестровье. Для завершения регистрации подтвердите ваш email адрес.
              </Text>
  
              <Section style={buttonContainer}>
                <Button style={button} href={verificationUrl}>
                  Подтвердить email
                </Button>
              </Section>
  
              <Text style={hint}>
                Кнопка не работает? Скопируйте и откройте ссылку в браузере:
              </Text>
              <Text style={link}>{verificationUrl}</Text>
  
              <Hr style={hr} />
  
              <Text style={footer}>
                Ссылка действительна 24 часа. Если вы не регистрировались на Sferus —
                просто проигнорируйте это письмо.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    )
  }
  
  const main: React.CSSProperties = {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }
  
  const container: React.CSSProperties = {
    margin: '0 auto',
    padding: '40px 20px',
    maxWidth: '560px',
  }
  
  const logoSection: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '32px',
  }
  
  const logo: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#347bfe',
    margin: '0',
    letterSpacing: '-0.5px',
  }
  
  const content: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '40px',
    border: '1px solid #e8eaed',
  }
  
  const heading: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: '0',
    marginBottom: '24px',
  }
  
  const paragraph: React.CSSProperties = {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#444',
    margin: '0 0 16px',
  }
  
  const buttonContainer: React.CSSProperties = {
    textAlign: 'center',
    margin: '32px 0',
  }
  
  const button: React.CSSProperties = {
    backgroundColor: '#347bfe',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
    padding: '14px 32px',
  }
  
  const hint: React.CSSProperties = {
    fontSize: '13px',
    color: '#888',
    margin: '0 0 8px',
  }
  
  const link: React.CSSProperties = {
    fontSize: '12px',
    color: '#347bfe',
    wordBreak: 'break-all',
    margin: '0 0 24px',
  }
  
  const hr: React.CSSProperties = {
    borderColor: '#e8eaed',
    margin: '24px 0 20px',
  }
  
  const footer: React.CSSProperties = {
    fontSize: '12px',
    color: '#aaa',
    lineHeight: '1.5',
    margin: '0',
  }
  