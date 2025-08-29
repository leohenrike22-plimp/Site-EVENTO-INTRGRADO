<?php
// C:\xampp\htdocs\site-evento-intrgrado\Site\api\pagamento.php

// Define o cabeçalho para que o navegador entenda que a resposta é um JSON
header('Content-Type: application/json');

// Habilita CORS (necessário se o front-end e o back-end estiverem em domínios diferentes)
// Para ambiente de produção, ajuste para o domínio específico do seu site.
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Responde a requisições OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Verifica se a requisição é do tipo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Método não permitido.']);
    exit();
}

// Decodifica os dados JSON enviados pelo JavaScript
$data = json_decode(file_get_contents('php://input'), true);

// Lógica de processamento e comunicação com a API de pagamento
$forma_pagamento = $data['forma-pagamento'] ?? '';

$resposta = [];

switch ($forma_pagamento) {
    case 'pix':
        // --- AQUI ENTRA A INTEGRAÇÃO COM A API DE PAGAMENTO REAL ---
        // Exemplo de como ficaria a integração com um SDK:
        //
        // require 'vendor/autoload.php'; // Se estiver usando Composer
        // use PagSeguro\Configuration\Configure;
        //
        // $client = new \MercadoPago\Client();
        // $pix_data = $client->createPixPayment([ ... ]);
        // $resposta = [
        //     'status' => 'success',
        //     'tipo' => 'pix',
        //     'qrcode' => $pix_data['point_of_interaction']['transaction_data']['qr_code_base64'],
        //     'linha_digitavel' => $pix_data['point_of_interaction']['transaction_data']['qr_code']
        // ];
        
        // Simulação de resposta da API de pagamento para PIX
        $resposta = [
            'status' => 'success',
            'tipo' => 'pix',
            'qrcode_url' => 'https://via.placeholder.com/200x200.png?text=QR+Code+Pix',
            'linha_digitavel' => '00020126580014BR.GOV.BCB.PIX01362f6b3b5c-43f1-4a3e-a74c-47a3e745f65f5204000053039865802BR5915NOME+DO+EVENTO6009SAO+PAULO62070503***63046D93',
            'mensagem' => 'Pagamento via Pix gerado com sucesso!'
        ];
        break;

    case 'cartao':
        // --- AQUI ENTRA A INTEGRAÇÃO COM A API DE PAGAMENTO REAL ---
        // Simulação de resposta da API de pagamento para Cartão
        $numero_cartao = $data['numero-cartao'] ?? '';
        $resposta = [
            'status' => 'success',
            'tipo' => 'cartao',
            'mensagem' => 'Pagamento com cartão processado com sucesso!',
            'transacao_id' => 'TXN' . uniqid(),
            'bandeira' => 'Visa',
            'ultimos_4_digitos' => substr($numero_cartao, -4)
        ];
        break;

    case 'boleto':
        // --- AQUI ENTRA A INTEGRAÇÃO COM A API DE PAGAMENTO REAL ---
        // Simulação de resposta da API de pagamento para Boleto
        $resposta = [
            'status' => 'success',
            'tipo' => 'boleto',
            'linha_digitavel' => '12345678901234567890123456789012345678901234',
            'vencimento' => date('d/m/Y', strtotime('+5 days')),
            'pdf_url' => 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Link para um PDF de boleto simulado
            'mensagem' => 'Boleto gerado com sucesso!'
        ];
        break;

    default:
        $resposta = ['error' => 'Forma de pagamento inválida.'];
        break;
}

// Retorna a resposta como JSON
echo json_encode($resposta);
?>