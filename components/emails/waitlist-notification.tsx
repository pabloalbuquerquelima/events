import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface WaitlistNotificationEmailProps {
  userName: string;
  eventTitle: string;
  position: number;
}

export const WaitlistNotificationEmail = (
  props: WaitlistNotificationEmailProps
) => {
  return (
    <Html dir="ltr" lang="pt-BR">
      <Tailwind>
        <Head />
        <Preview>
          Você foi adicionado à lista de espera - {props.eventTitle}
        </Preview>
        <Body className="bg-gray-100 py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] rounded-[8px] bg-white p-[40px] shadow-sm">
            <Section className="mb-[32px] text-center">
              <Heading className="m-0 mb-[8px] font-bold text-[28px] text-gray-900">
                Lista de Espera ⏳
              </Heading>
              <Text className="m-0 text-[16px] text-gray-600">
                {props.eventTitle}
              </Text>
            </Section>

            <Section className="mb-[32px]">
              <Text className="m-0 mb-[16px] text-[16px] text-gray-700">
                Olá, {props.userName}!
              </Text>
              <Text className="m-0 mb-[16px] text-[16px] text-gray-700">
                O evento <strong>{props.eventTitle}</strong> está com vagas
                esgotadas no momento, mas você foi adicionado à lista de espera!
              </Text>

              <div className="mb-[24px] rounded-[8px] bg-blue-50 p-[20px] text-center">
                <Text className="m-0 mb-[8px] font-bold text-[24px] text-blue-600">
                  Posição #{props.position}
                </Text>
                <Text className="m-0 text-[14px] text-gray-600">
                  na lista de espera
                </Text>
              </div>

              <Text className="m-0 mb-[16px] text-[16px] text-gray-700">
                Você será notificado automaticamente por e-mail caso uma vaga
                seja liberada. Fique atento!
              </Text>
            </Section>

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
