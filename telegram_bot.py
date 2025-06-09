import logging
import asyncio
import httpx
from telegram import Update
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    ConversationHandler,
    filters,
    ContextTypes,
)

TOKEN = "7225950569:AAEfo11SFXz_iH6s0yj3DgFLisDoauMky4o"
WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwaj2ykBqQ3vRHPktKr_YBEoVkeJ7cTX5kG-HzZ7sV7JBmY0SFM1w1peCzEER0asT7H/exec"

NAME, EMAIL, PHONE, MODE = range(4)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.message.reply_text(
        "Здравствуйте! Для регистрации на мастер-класс, пожалуйста, напишите свое имя."
    )
    return NAME


async def get_name(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["name"] = update.message.text.strip()
    await update.message.reply_text("Введите email:")
    return EMAIL


async def get_email(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["email"] = update.message.text.strip()
    await update.message.reply_text(
        "Введите телефон (можно пропустить командой /skip):"
    )
    return PHONE


async def skip_phone(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["phone"] = ""
    await update.message.reply_text("Выберите формат участия: offline или online")
    return MODE


async def get_phone(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["phone"] = update.message.text.strip()
    await update.message.reply_text("Выберите формат участия: offline или online")
    return MODE


async def get_mode(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    mode = update.message.text.lower().strip()
    if mode not in {"offline", "online"}:
        await update.message.reply_text("Пожалуйста, введите offline или online")
        return MODE
    context.user_data["mode"] = mode

    payload = {
        "name": context.user_data["name"],
        "email": context.user_data["email"],
        "phone": context.user_data["phone"],
        "mode": context.user_data["mode"],
    }

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(WEB_APP_URL, json=payload)
            data = resp.json()
            if data.get("status") == "ok":
                await update.message.reply_text(
                    "Успешно зарегистрировано! Информация отправлена на почту."
                )
            else:
                await update.message.reply_text(
                    f"Ошибка регистрации: {data.get('message', 'неизвестно')}"
                )
    except Exception as e:
        logger.error("Ошибка при отправке данных", exc_info=e)
        await update.message.reply_text(
            "Не удалось отправить данные. Попробуйте позже."
        )

    return ConversationHandler.END


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.message.reply_text("Регистрация отменена.")
    return ConversationHandler.END


async def main() -> None:
    application = ApplicationBuilder().token(TOKEN).build()

    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            NAME: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_name)],
            EMAIL: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_email)],
            PHONE: [
                CommandHandler("skip", skip_phone),
                MessageHandler(filters.TEXT & ~filters.COMMAND, get_phone),
            ],
            MODE: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_mode)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )

    application.add_handler(conv_handler)

    await application.initialize()
    await application.start()
    await application.updater.start_polling()
    await application.updater.idle()


if __name__ == "__main__":
    asyncio.run(main())
