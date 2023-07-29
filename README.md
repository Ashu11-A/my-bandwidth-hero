<div align="center">

# ![Logo Image](https://raw.githubusercontent.com/ayastreb/bandwidth-hero/master/src/assets/logo.png)

![Comitts Year](https://img.shields.io/github/commit-activity/y/Ashu11-A/my-bandwidth-hero?colorA=302D41&colorB=f9e2af&style=for-the-badge)

![Last-Comitt](https://img.shields.io/github/last-commit/Ashu11-A/my-bandwidth-hero?style=for-the-badge&colorA=302D41&colorB=b4befe)
![Contributors](https://img.shields.io/github/contributors-anon/Ashu11-A/my-bandwidth-hero?style=for-the-badge&colorA=302D41&colorB=b4befe)

<!--
[![CodeFactor](https://www.codefactor.io/repository/github/Ashu11-A/my-bandwidth-hero/badge?style=for-the-badge&colorA=302D41&colorB=b4befe)](https://www.codefactor.io/repository/github/Ashu11-A/my-bandwidth-hero)
-->

</div>

<h1 align="center">My bandwidth hero</h1>
<h5 align="center">
    <strong>
        Esse é o meu compressor de imagens que usarei no Tachiyomi
    </strong>
</h5>

- Um fork de [bandwidth-hero-proxy](https://github.com/ayastreb/bandwidth-hero-proxy)

## 🤔 - Porque eu fiz isso?
O bandwidth-hero-proxy tem um probleminha de uso de Ram, ele cresce exponencialmente conforme comprime imagens, até estourar o limite imposto, a causa é a forma que o Buffer é utilizado, por isso criei este fork para tentar corrigir este problema e também comprimir mais ainda as imagens.

## 📝 - Oque há de diferente:

- Mudança da utilização do pacote request para o axios, pois o mesmo foi descontinuado e é antigo.
- A forma como o Buffer é tratado mudou, agora menos lixo fica na memoria (Não testado em larga escala).
- Mudança de pasta, agora a compreensão das imagens fica na pasta img, futuramente será implementado a compreensão de vídeo.
- Implementação de um Database, para permitir à mostragem de informações uteis, como o dataSaved.
- Novos argumentos do sharp foram colocados na compreensão das imagens (ainda será mudado).
- O código foi lintado, e reorganizado para a forma que eu acho a mais correta.
- Nova verificação foi imposta no copyHeaders para impedir possíveis problemas.
- As vezes a compreensão gera imagens maiores que as originais, então porque não enviar as imagens originais se isso acontecer? kkkkkkk.
- Melhor tratativa de erros.
- Adicionado função assíncrona para que a resposta seja devidamente enviada antes que o buffer seja apagado.
