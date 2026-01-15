import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface RegistrationConfirmationEmailProps {
  userName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  qrCodeUrl: string;
}

const RegistrationConfirmationEmail = (
  props: RegistrationConfirmationEmailProps
) => {
  return (
    <Html dir="ltr" lang="pt-BR">
      <Tailwind>
        <Head />
        <Preview>
          Confirmação de Inscrição - {props.eventTitle} - SEDUC Coreaú
        </Preview>
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[40px] shadow-sm">
            {/* Header */}
            <Section className="mb-[32px] text-center">
              <Heading className="m-0 mb-[8px] font-bold text-[28px] text-gray-900">
                Inscrição Confirmada! 🎉
              </Heading>
              <Text className="m-0 text-[16px] text-gray-600">
                {props.eventTitle}
              </Text>
            </Section>

            {/* Main Content */}
            <Section className="mb-[32px]">
              <Text className="m-0 mb-[16px] text-[16px] text-gray-700">
                Olá, {props.userName}!
              </Text>
              <Text className="m-0 mb-[16px] text-[16px] text-gray-700">
                Sua inscrição no evento <strong>{props.eventTitle}</strong> foi
                confirmada com sucesso!
              </Text>

              <div className="mb-[24px] rounded-[8px] bg-gray-50 p-[20px]">
                <Text className="m-0 mb-[8px] font-semibold text-[14px] text-gray-700">
                  📅 Data: {props.eventDate}
                </Text>
                <Text className="m-0 mb-[8px] font-semibold text-[14px] text-gray-700">
                  🕐 Horário: {props.eventTime}
                </Text>
                <Text className="m-0 font-semibold text-[14px] text-gray-700">
                  📍 Local: {props.eventLocation}
                </Text>
              </div>

              <Text className="m-0 mb-[24px] text-[16px] text-gray-700">
                Guarde este e-mail! Você precisará apresentar o QR Code na
                entrada do evento.
              </Text>
            </Section>

            {/* QR Code */}
            <Section className="mb-[32px] text-center">
              <div className="rounded-[8px] border-2 border-blue-600 bg-white p-[24px]">
                <Text className="m-0 mb-[16px] font-semibold text-[16px] text-gray-900">
                  Seu QR Code de Entrada
                </Text>
                <img
                  alt="QR Code"
                  className="mx-auto"
                  src={props.qrCodeUrl}
                  style={{ width: "200px", height: "200px" }}
                />
              </div>
            </Section>

            {/* CTA Button */}
            <Section className="mb-[32px] text-center">
              <Button
                className="box-border inline-block rounded-[6px] bg-blue-600 px-[24px] py-[12px] font-medium text-[16px] text-white no-underline"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/painel/minhas-inscricoes`}
              >
                Ver Minhas Inscrições
              </Button>
            </Section>

            {/* Important Info */}
            <Section className="mb-[32px] rounded-[8px] bg-yellow-50 p-[20px]">
              <Text className="m-0 mb-[8px] font-semibold text-[14px] text-gray-700">
                ⚠️ Importante:
              </Text>
              <Text className="m-0 mb-[8px] text-[14px] text-gray-600">
                • Chegue com 15 minutos de antecedência
              </Text>
              <Text className="m-0 mb-[8px] text-[14px] text-gray-600">
                • Traga documento de identificação
              </Text>
              <Text className="m-0 text-[14px] text-gray-600">
                • Apresente o QR Code na entrada
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-gray-200 border-t pt-[24px]">
              <Text className="m-0 mb-[8px] text-center text-[12px] text-gray-500">
                SEDUC Coreaú - Secretaria de Educação
              </Text>
              <Text className="m-0 text-center text-[12px] text-gray-500">
                © {new Date().getFullYear()} Todos os direitos reservados.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default RegistrationConfirmationEmail;
