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

interface WaitlistPromotedEmailProps {
  userName: string;
  eventTitle: string;
  eventDate: string;
  qrCodeUrl: string;
}

const WaitlistPromotedEmail = (props: WaitlistPromotedEmailProps) => {
  return (
    <Html dir="ltr" lang="pt-BR">
      <Tailwind>
        <Head />
        <Preview>Boa notícia! Uma vaga abriu para {props.eventTitle}</Preview>
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[40px] shadow-sm">
            <Section className="mb-[32px] text-center">
              <Heading className="m-0 mb-[8px] font-bold text-[28px] text-gray-900">
                Boa Notícia! 🎉
              </Heading>
              <Text className="m-0 text-[16px] text-gray-600">
                Uma vaga abriu!
              </Text>
            </Section>

            <Section className="mb-[32px]">
              <Text className="m-0 mb-[16px] text-[16px] text-gray-700">
                Olá, {props.userName}!
              </Text>
              <Text className="m-0 mb-[16px] text-[16px] text-gray-700">
                Temos uma ótima notícia! Uma vaga foi liberada no evento{" "}
                <strong>{props.eventTitle}</strong> e sua inscrição foi
                confirmada automaticamente!
              </Text>

              <div className="mb-[24px] rounded-[8px] bg-green-50 p-[20px] text-center">
                <Text className="m-0 mb-[8px] font-bold text-[20px] text-green-600">
                  ✓ Inscrição Confirmada
                </Text>
                <Text className="m-0 text-[14px] text-gray-600">
                  Você agora tem uma vaga garantida!
                </Text>
              </div>

              {/* QR Code */}
              <div className="mb-[24px] rounded-[8px] border-2 border-green-600 bg-white p-[24px]">
                <Text className="m-0 mb-[16px] text-center font-semibold text-[16px] text-gray-900">
                  Seu QR Code de Entrada
                </Text>
                <img
                  alt="QR Code"
                  className="mx-auto"
                  src={props.qrCodeUrl}
                  style={{ width: "200px", height: "200px" }}
                />
              </div>

              <Text className="m-0 mb-[16px] text-[16px] text-gray-700">
                Data do evento: <strong>{props.eventDate}</strong>
              </Text>
            </Section>

            <Section className="mb-[32px] text-center">
              <Button
                className="box-border inline-block rounded-[6px] bg-blue-600 px-[24px] py-[12px] font-medium text-[16px] text-white no-underline"
                href={`${process.env.NEXT_PUBLIC_APP_URL}/painel/minhas-inscricoes`}
              >
                Ver Minhas Inscrições
              </Button>
            </Section>

            <Section className="border-gray-200 border-t pt-[24px]">
              <Text className="m-0 text-center text-[12px] text-gray-500">
                SEDUC Coreaú - Secretaria de Educação
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default WaitlistPromotedEmail;
