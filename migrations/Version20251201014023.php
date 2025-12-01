<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251201014023 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE pharmacy (id UUID NOT NULL, name VARCHAR(150) NOT NULL, address VARCHAR(255) NOT NULL, phone VARCHAR(20) NOT NULL, tax_number VARCHAR(20) DEFAULT NULL, pharmacy_code VARCHAR(20) DEFAULT NULL, owner_id UUID NOT NULL, PRIMARY KEY (id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_D6C15C1E7E3C61F9 ON pharmacy (owner_id)');
        $this->addSql('ALTER TABLE pharmacy ADD CONSTRAINT FK_D6C15C1E7E3C61F9 FOREIGN KEY (owner_id) REFERENCES users (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE medication ALTER description TYPE TEXT');
        $this->addSql('ALTER TABLE medication ALTER image_url TYPE VARCHAR(255)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE pharmacy DROP CONSTRAINT FK_D6C15C1E7E3C61F9');
        $this->addSql('DROP TABLE pharmacy');
        $this->addSql('ALTER TABLE medication ALTER description TYPE VARCHAR(200)');
        $this->addSql('ALTER TABLE medication ALTER image_url TYPE VARCHAR(500)');
    }
}
