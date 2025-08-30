import express from "express";
import mercadopago from "mercadopago";

const app = express();
app.use(express.json());

// configure com seu token do Mercado Pago
mercadopago.configure({
    access_token: "SEU_ACCESS_TOKEN_AQUI"
});

// rota para criar pagamento
app.post("/criar-pagamento", async (req, res) => {
    try {
        const { nome, categoria, valor, formaPagamento } = req.body;

        const pagamento = await mercadopago.payment.create({
            transaction_amount: parseFloat(valor.replace(",", ".")),
            description: `Inscrição - ${categoria}`,
            payment_method_id: formaPagamento,
            payer: {
                email: "teste@teste.com" // pode vir do form
            }
        });

        res.json(pagamento.response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao processar pagamento" });
    } 
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
