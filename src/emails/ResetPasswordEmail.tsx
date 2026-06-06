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
  
  interface ResetPasswordEmailProps {
    name: string
    resetUrl: string
  }
  
  export function ResetPasswordEmail({ name, resetUrl }: ResetPasswordEmailProps) {
    const firstName = name.split(' ')[0]
  
    return (
      <Html lang="ru">
        <Head />
        <Preview>Сброс пароля на Sferus</Preview>
        <Body style={main}>
          <Container style={container}>
            <Section style={logoSection}>
              <Text style={logo}>sferus</Text>
            </Section>
  
            <Section style={content}>
              <Heading style={heading}>Сброс пароля</Heading>
  
              <Text style={paragraph}>Привет, {firstName}!</Text>
              <Text style={paragraph}>
                Мы получили запрос на сброс пароля для вашего аккаунта на Sferus.
                Нажмите кнопку ниже чтобы придумать новый пароль.
              </Text>
  
              <Section style={buttonContainer}>
                <Button style={button} href={resetUrl}>
                  Сбросить пароль
                </Button>
              </Section>
  
              <Text style={hint}>
                Кнопка не работает? Скопируйте и откройте ссылку в браузере:
              </Text>
              <Text style={link}>{resetUrl}</Text>
  
              <Hr style={hr} />
  
              <Text style={footer}>
                Ссылка действительна 1 час. Если вы не запрашивали сброс пароля —
                просто проигнорируйте это письмо. Ваш пароль останется прежним.
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
  