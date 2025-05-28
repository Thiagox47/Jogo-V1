# -*- coding: utf-8 -*-
# app.py
from flask import Flask, render_template, session, jsonify, request
import time

app = Flask(__name__)
# É CRUCIAL definir uma chave secreta forte para a sessão em um ambiente de produção!
app.secret_key = 'uma_chave_secreta_muito_segura_aqui_12345'

# --- CONSTANTES DO JOGO ---
# Valores iniciais
INITIAL_MONEY = 0.0
INITIAL_DIAMONDS = 0 # "Grana suja"

# Suco de Laranja
JUICE_BASE_PRICE = 1.0
JUICE_MULTIPLIER_COST_INITIAL = 10.0
JUICE_MULTIPLIER_INCREASE = 1.5 # Quanto o multiplicador aumenta por compra
JUICE_UPGRADE_COST_SCALING = 2.5 # Fator pelo qual o custo do upgrade de multiplicador aumenta
JUICE_SELLER_COST_INITIAL = 1500.0
JUICE_SELLER_INTERVAL_SECONDS = 3 # Vendedor "vende" automaticamente a cada X segundos

# Picolé
POPSICLE_BASE_PRICE = 3.50
POPSICLE_UNLOCK_COST_INITIAL = 35.00
POPSICLE_MULTIPLIER_COST_INITIAL = 35.00 # Custo do primeiro upgrade de multiplicador após desbloqueio
POPSICLE_MULTIPLIER_INCREASE = 3.0
POPSICLE_UPGRADE_COST_SCALING = 2.5

# --- FUNÇÕES AUXILIARES DE ESTADO DO JOGO ---
def initialize_game_state():
    """Inicializa ou reseta o estado do jogo na sessão."""
    session['player_name'] = "Jogador Anônimo" # Nome padrão
    session['money'] = INITIAL_MONEY
    session['diamonds'] = INITIAL_DIAMONDS

    # Estado do Suco
    session['juice_multiplier'] = 1.0
    session['juice_multiplier_cost'] = JUICE_MULTIPLIER_COST_INITIAL
    session['juice_seller_active'] = False
    session['juice_seller_cost'] = JUICE_SELLER_COST_INITIAL
    session['juice_seller_last_collection_time'] = None # Timestamp da última coleta do vendedor

    # Estado do Picolé
    session['popsicle_unlocked'] = False
    session['popsicle_unlock_cost'] = POPSICLE_UNLOCK_COST_INITIAL
    session['popsicle_multiplier'] = 1.0
    # O custo do multiplicador de picolé só é relevante após o desbloqueio
    session['popsicle_multiplier_cost'] = POPSICLE_MULTIPLIER_COST_INITIAL

def calculate_passive_income():
    """Calcula e adiciona renda passiva (ex: do vendedor de suco)."""
    if session.get('juice_seller_active'):
        last_collection_time = session.get('juice_seller_last_collection_time')
        if last_collection_time is None: # Primeira vez ativando
            session['juice_seller_last_collection_time'] = time.time()
            return

        current_time = time.time()
        elapsed_time = current_time - last_collection_time
        
        juice_value_per_sale = JUICE_BASE_PRICE * session.get('juice_multiplier', 1.0)
        passive_juices_sold = int(elapsed_time // JUICE_SELLER_INTERVAL_SECONDS)

        if passive_juices_sold > 0:
            income_generated = passive_juices_sold * juice_value_per_sale
            session['money'] = session.get('money', 0.0) + income_generated
            session['juice_seller_last_collection_time'] = last_collection_time + (passive_juices_sold * JUICE_SELLER_INTERVAL_SECONDS)

def get_game_state_dict():
    """Retorna um dicionário com o estado atual do jogo para o frontend."""
    if 'money' not in session: 
        initialize_game_state()
    
    calculate_passive_income()

    money = session.get('money', 0.0)

    current_juice_price = JUICE_BASE_PRICE * session.get('juice_multiplier', 1.0)
    current_popsicle_price = POPSICLE_BASE_PRICE * session.get('popsicle_multiplier', 1.0)

    return {
        'playerName': session.get('player_name'),
        'money': round(money, 2),
        'diamonds': session.get('diamonds', 0),
        'juicePrice': round(current_juice_price, 2),
        'juiceMultiplierCost': round(session.get('juice_multiplier_cost', JUICE_MULTIPLIER_COST_INITIAL), 2),
        'canAffordJuiceMultiplier': money >= session.get('juice_multiplier_cost', JUICE_MULTIPLIER_COST_INITIAL),
        'juiceSellerCost': round(session.get('juice_seller_cost', JUICE_SELLER_COST_INITIAL), 2),
        'juiceSellerActive': session.get('juice_seller_active', False),
        'canAffordJuiceSeller': not session.get('juice_seller_active', False) and \
                                money >= session.get('juice_seller_cost', JUICE_SELLER_COST_INITIAL),
        'popsicleUnlocked': session.get('popsicle_unlocked', False),
        'popsicleUnlockCost': round(session.get('popsicle_unlock_cost', POPSICLE_UNLOCK_COST_INITIAL), 2),
        'canAffordPopsicleUnlock': not session.get('popsicle_unlocked', False) and \
                                   money >= session.get('popsicle_unlock_cost', POPSICLE_UNLOCK_COST_INITIAL),
        'popsiclePrice': round(current_popsicle_price, 2),
        'popsicleMultiplierCost': round(session.get('popsicle_multiplier_cost', POPSICLE_MULTIPLIER_COST_INITIAL), 2),
        'canAffordPopsicleMultiplier': session.get('popsicle_unlocked', False) and \
                                       money >= session.get('popsicle_multiplier_cost', POPSICLE_MULTIPLIER_COST_INITIAL),
    }

# --- ROTAS DA APLICAÇÃO ---
@app.route('/')
def index_route():
    if 'money' not in session:
        initialize_game_state()
    return render_template('index.html', initial_game_state=get_game_state_dict())

@app.route('/set_player_name', methods=['POST'])
def set_player_name_route():
    data = request.get_json()
    name = data.get('name', '').strip()
    if not name or len(name) < 2:
        return jsonify(success=False, message="Por favor, insira um nome válido (mínimo 2 caracteres).", game_state=get_game_state_dict()), 400
    
    session['player_name'] = name
    if 'money' not in session:
        initialize_game_state()
    session['player_name'] = name 

    return jsonify(success=True, message=f"Bem-vindo, {name}!", game_state=get_game_state_dict())

@app.route('/action/<action_name>', methods=['POST'])
def handle_action_route(action_name):
    if 'money' not in session: 
        initialize_game_state()
        return jsonify(success=False, message="Sua sessão foi reiniciada. Tente a ação novamente.", game_state=get_game_state_dict()), 400

    calculate_passive_income()

    money = session['money']
    action_successful = True
    message = "Ação realizada com sucesso!"

    if action_name == 'sell_juice':
        juice_value = JUICE_BASE_PRICE * session['juice_multiplier']
        session['money'] += juice_value
        message = f"+ ${juice_value:.2f} (Suco)"
    elif action_name == 'sell_popsicle':
        if session['popsicle_unlocked']:
            popsicle_value = POPSICLE_BASE_PRICE * session['popsicle_multiplier']
            session['money'] += popsicle_value
            message = f"+ ${popsicle_value:.2f} (Picolé)"
        else:
            action_successful = False
            message = "Picolés ainda não foram desbloqueados!"
    elif action_name == 'buy_juice_multiplier':
        cost = session['juice_multiplier_cost']
        if money >= cost:
            session['money'] -= cost
            session['juice_multiplier'] += JUICE_MULTIPLIER_INCREASE
            session['juice_multiplier_cost'] *= JUICE_UPGRADE_COST_SCALING
            message = "Multiplicador de suco comprado!"
        else:
            action_successful = False
            message = "Dinheiro insuficiente para o multiplicador de suco."
    elif action_name == 'buy_juice_seller':
        cost = session['juice_seller_cost']
        if not session['juice_seller_active'] and money >= cost:
            session['money'] -= cost
            session['juice_seller_active'] = True
            session['juice_seller_last_collection_time'] = time.time() 
            message = "Vendedor de suco contratado!"
        elif session['juice_seller_active']:
            action_successful = False
            message = "Você já possui um vendedor de suco."
        else:
            action_successful = False
            message = "Dinheiro insuficiente para contratar o vendedor de suco."
    elif action_name == 'unlock_or_upgrade_popsicle':
        if not session['popsicle_unlocked']: 
            cost = session['popsicle_unlock_cost']
            if money >= cost:
                session['money'] -= cost
                session['popsicle_unlocked'] = True
                session['popsicle_multiplier_cost'] = POPSICLE_MULTIPLIER_COST_INITIAL
                message = "Picolés desbloqueados!"
            else:
                action_successful = False
                message = "Dinheiro insuficiente para desbloquear picolés."
        else: 
            cost = session['popsicle_multiplier_cost']
            if money >= cost:
                session['money'] -= cost
                session['popsicle_multiplier'] += POPSICLE_MULTIPLIER_INCREASE
                session['popsicle_multiplier_cost'] *= POPSICLE_UPGRADE_COST_SCALING
                message = "Multiplicador de picolé comprado!"
            else:
                action_successful = False
                message = "Dinheiro insuficiente para o upgrade de picolé."
    else:
        action_successful = False
        message = "Ação desconhecida."
        return jsonify(success=action_successful, message=message, game_state=get_game_state_dict()), 404

    if not action_successful:
        return jsonify(success=action_successful, message=message, game_state=get_game_state_dict()), 400
    
    return jsonify(success=action_successful, message=message, game_state=get_game_state_dict())

@app.route('/reset_game', methods=['POST'])
def reset_game_route():
    initialize_game_state()
    return jsonify(success=True, message="Jogo reiniciado!", game_state=get_game_state_dict())

if __name__ == '__main__':
    import os
    if not os.path.exists('templates'):
        os.makedirs('templates')
    if not os.path.exists('templates/index.html'):
        with open('templates/index.html', 'w', encoding='utf-8') as f: 
            f.write('<h1>Placeholder - O arquivo index.html será gerado aqui.</h1>')

    app.run(debug=True, port=5001)