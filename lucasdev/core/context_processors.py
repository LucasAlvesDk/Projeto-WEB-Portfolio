from django.conf import settings


def notificacao_ms(request):
    """
    Disponibiliza as configuracoes do microservico de notificacao
    em todos os templates automaticamente.

    Variaveis disponiveis nos templates:
        {{ NOTIFICACAO_MS_URL }}     -> URL base do microservico
        {{ NOTIFICACAO_MS_API_KEY }} -> Hash da empresa (API Key)
        {{ NOTIFICACAO_USER_ID }}    -> ID do usuario logado (so se autenticado)
    """
    context = {
        'NOTIFICACAO_MS_URL': settings.NOTIFICACAO_MS_URL,
        'NOTIFICACAO_MS_API_KEY': settings.NOTIFICACAO_MS_API_KEY,
    }

    if request.user.is_authenticated:
        context['NOTIFICACAO_USER_ID'] = request.user.id

    return context
