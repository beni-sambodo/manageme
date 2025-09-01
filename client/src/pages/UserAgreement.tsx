
import { Layout, Anchor } from "antd";
import {Link as LayoutLink} from "react-router-dom"
import { useTranslation } from "react-i18next";
import Logo from "../assets/Logo.png";
const { Content, Sider } = Layout;
const { Link } = Anchor;

const UserAgreement: React.FC = () => {
  const { t, i18n } = useTranslation();
  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("ln", value);
  };

  return (
    <Layout className="min-h-screen">
      <Sider className="bg-gray-100 hidden md:flex flex-col justify-between p-4">
        <LayoutLink to="/" className="hidden mb-5 md:flex items-center gap-5">
          <img
            src={Logo}
            loading="lazy"
            className="w-[45px]"
            alt="manageme.uz"
          />
          <span className="text-xl font-semibold">ManageMe</span>
        </LayoutLink>
        <Anchor>
          <Link href="#introduction" title={t("translation.introduction")} />
          <Link href="#acceptance" title={t("translation.acceptance")} />
          <Link href="#registration" title={t("translation.registration")} />
          <Link href="#usage" title={t("translation.usage")} />
          <Link href="#privacy" title={t("translation.privacy")} />
          <Link href="#liability" title={t("translation.liability")} />
          <Link href="#changes" title={t("translation.changes")} />
          <Link href="#termination" title={t("translation.termination")} />
          <Link href="#disputes" title={t("translation.disputes")} />
          <Link href="#contact" title={t("translation.contact")} />
          <div className="mt-4 flex items-center gap-2 justify-center">
            <button
              className="hover:text-main"
              onClick={() => handleLanguageChange("en")}
            >
              eng
            </button>
            /
            <button
              className="hover:text-main"
              onClick={() => handleLanguageChange("ru")}
            >
              рус
            </button>
            /
            <button
              className="hover:text-main"
              onClick={() => handleLanguageChange("uz")}
            >
              uzb
            </button>
          </div>
        </Anchor>
      </Sider>
      <Layout className="bg-white p-6">
        <Content>
          <section id="introduction" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t("translation.introduction")}
            </h2>
            <p>{t("translation.introduction_content")}</p>
          </section>

          <section id="acceptance" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t("translation.acceptance")}
            </h2>
            <p>{t("translation.acceptance_content")}</p>
          </section>

          <section id="registration" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t("translation.registration")}
            </h2>
            <p>{t("translation.registration_content_1")}</p>
            <p>{t("translation.registration_content_2")}</p>
          </section>

          <section id="usage" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t("translation.usage")}
            </h2>
            <p>{t("translation.usage_content_1")}</p>
            <p>{t("translation.usage_content_2")}</p>
            <p>{t("translation.usage_content_3")}</p>
          </section>

          <section id="privacy" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t("translation.privacy")}
            </h2>
            <p>{t("translation.privacy_content_1")}</p>
            <p>{t("translation.privacy_content_2")}</p>
          </section>

          <section id="liability" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t("translation.liability")}
            </h2>
            <p>{t("translation.liability_content_1")}</p>
            <p>{t("translation.liability_content_2")}</p>
          </section>

          <section id="changes" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t("translation.changes")}
            </h2>
            <p>{t("translation.changes_content_1")}</p>
            <p>{t("translation.changes_content_2")}</p>
          </section>

          <section id="termination" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t("translation.termination")}
            </h2>
            <p>{t("translation.termination_content")}</p>
          </section>

          <section id="disputes" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t("translation.disputes")}
            </h2>
            <p>{t("translation.disputes_content_1")}</p>
            <p>{t("translation.disputes_content_2")}</p>
          </section>

          <section id="contact" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {t("translation.contact")}
            </h2>
            <p>{t("translation.contact_content")}</p>
          </section>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserAgreement;
