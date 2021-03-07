## INSTALL 

```cmd
yarn add typeorm reflect-metadata express sqlite3
```
- typeorm
- reflect-metadata(dependecia do typeorm)
- Express
- sqlite3

### DevDependencies

```cmd
yarn add typescript ts-node-dev -D
```
- typescript
- ts-node-dev

# SCRIPTS

Em package.json:
```json
"scripts": {
    "dev": "ts-node-dev --transpile-only --ignore-watch node_modules src/server.ts ",
    "typeorm": "ts-node ./node_modules/typeorm/cli.js"
    }

```

### ABOUT CLI

Na pasta package.json é necessario criar um Script chamado TYPEORM responsavel para acessar a CLI dentro dos node_modules, isso permitira maior facilidade para acessar os comandos de createMigration entre outros.

# ORMCONFIG.JSON

Arquivo json que armazena as informações necessarias para conexão ao banco de dados 

```json
{
    "type": "sqlite", //tipo do db utilizado
    "database": "./src/database/database.sqlite", //nome do db ou no caso do sqlite3 o caminho do arquivo
    "migrations": ["./src/database/migrations/**.ts"], //diretorio em que o typeorm usa para buscar os arquivos .ts da migratios
    "entities": ["./src/models/**.ts"],//diretorio em que o typeorm usa para buscar os entities/models/class .ts da migratios
    "logging": true, //permite visualizar o comando SQL de cada query realizada
    "cli": {
        "migrationsDir": "./src/database/migrations" // sinaliza o diretorio em que a migration deve ser criada
    }
      
}

```
## MIGRATIONS

É necessario criar um caminho em ormconfig.json para descrever o caminho em que as migrations devem ser executados("migration": "./src/...").
Para criar as migrations é necessario utilizar o migrationDir no ormconfig dentro do objeto CLI.
Onde fica armazenados os comandos DDL (Linguagem de definição de dados) da database. É criado uma classe para cada tabela onde possui o metodo up e down
- metodo UP: responsavel por criar a tabela 
- metodo DOWN: responsavel por deletar, alterar etc  
<br>
- Criar migration:
```cmd
yarn typeorm migration:create -n CreateUsers
```
- Compilar migration:
```cmd
yarn typeorm migration:run
```

- Deletar/Alterar(ativar metodo down) migration:
```cmd
yarn typeorm migration:revert
```

## ENTITIES

Trata-se de uma classe que mapeia a tabela

```js
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    isActive: boolean;
```
### Entity Decorartor 
### @Entity("table_name")

Cada declaração de valor é acompalhado por um decorator que descreve o tipo daquele valor dentro do banco de dados

# CONTROLLERS

As funcionalidades responsaveis por realizar as 