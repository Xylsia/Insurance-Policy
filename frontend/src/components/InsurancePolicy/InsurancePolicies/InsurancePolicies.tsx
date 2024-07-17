import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../../contexts/AuthContext";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { useExportPolicies } from "./useExportPolicies";
import { Table } from "../../common/Table/Table";
import { TableSkeleton } from "../../common/Table/TableSkeleton";
import { ConfirmationModal } from "../../common/Modal/ConfimationModal";
import { ExportModal } from "../../common/Modal/ExportModal";
import { usePolicies } from "../../../hooks/usePolicies";
import { PrimaryButton } from "../../common/Button/PrimaryButton";
import { fetchWrapper } from "../../../utils/fetchWrapper";
import { InsurancePolicyModel } from "../../../models/InsurancePolicyModel";
import { URL, USER_ROLES } from "../../../constants";
import { BiSearchAlt } from "react-icons/bi";
import "./InsurancePolicies.scss";

export const InsurancePolicies = () => {
  const {
    policyList,
    loadMorePolicies,
    hasMore,
    refreshPolicyList,
    setSearchValue,
    key,
    isLoading,
  } = usePolicies();
  const { t } = useTranslation();
  const { roles } = useContext(AuthContext);
  const { setSnackbar } = useContext(SnackbarContext);
  const { exportPolicies } = useExportPolicies();

  const [modalOpenDeletePolicy, setModalOpenDeletePolicy] = useState<boolean>(false);
  const [itemToDelete, setItemtoDelete] = useState<number>(-1);
  const [modalOpenExport, setModalOpenExport] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const tableHeaders = [
    {
      id: "1",
      title: t("insurancePoliciesTableCreated"),
      field: "created",
    },
    {
      id: "2",
      title: t("insurancePoliciesTableRequester"),
      field: "requester",
    },
    {
      id: "3",
      title: t("insurancePoliciesTableAgent"),
      field: "agent",
    },
    {
      id: "4",
      title: t("insurancePoliciesInsuranceItem"),
      field: "insuranceItem",
    },
    {
      id: "5",
      title: t("insurancePoliciesTablePrice"),
      field: "price",
    },
  ];

  const tableData = policyList.map((policy: InsurancePolicyModel) => ({
    created: policy.dateCreated,
    requester: `${policy.requester.firstName} ${policy.requester.lastName}`,
    agent: `${policy.agent.firstName} ${policy.agent.lastName}`,
    insuranceItem: policy.insuranceItem,
    price: policy.estimatedPrice,
    id: policy.id,
  }));

  const handleDeletePolicyButtonClick = (id: number) => {
    setModalOpenDeletePolicy(true);
    setItemtoDelete(id);
  };

  const handleDeletePolicy = async (id: number) => {
    if (id === undefined) {
      return;
    }
    try {
      const response = await fetchWrapper({
        url: `${URL}insurance-policy/delete/${id}`,
        method: "DELETE",
      });

      if (!response.ok) {
        const erroData = await response.json();
        setSnackbar("error", erroData.message || t("snackbarNetworkError"));
        return;
      }

      await refreshPolicyList();
      setModalOpenDeletePolicy(false);
      window.scrollTo(0, 0);
      setSnackbar("success", `${t("insurancePoliciesSnackbarDeletePolicySuccess")} ${id}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSnackbar("error", t("insurancePoliciesSnackbarExportError"));
      } else {
        setSnackbar("error", t("snackbarUnexpectedError"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleOpenExportModal = () => {
    setModalOpenExport(true);
  };

  const handleExportPolicies = async (startDate: Date | null, endDate: Date | null) => {
    const exportPoliciesVals = {
      startDate: startDate,
      endDate: endDate,
      closeModal: () => setModalOpenExport(false),
    };
    await exportPolicies(exportPoliciesVals);
  };

  const handleEditPolicyButtonClick = () => {
    console.log("handleEditPolicyButtonClick");
  };

  return (
    <>
      <div className="create-search-container">
        <form>
          <div className="search-field-container">
            <input
              type="text"
              placeholder={t("insurancePoliciesSearchPlaceholder")}
              onChange={handleInputChange}
            />
            <div className="svg-icon">
              <BiSearchAlt />
            </div>
          </div>
        </form>
        <Link to="/create-policy" className="create-policy-btn">
          <PrimaryButton
            type="button"
            style="btn btn-success"
            text={t("insurancePoliciesCreatePolicyBtn")}
          />
        </Link>
        <PrimaryButton
          type="button"
          style="btn btn-primary"
          text={t("insurancePoliciesExportBtn")}
          action={handleOpenExportModal}
        />
      </div>

      {isLoading ? (
        <TableSkeleton headers={tableHeaders} showDelete={roles === USER_ROLES.ADMIN} />
      ) : (
        <div className="insurance-policy-form-container">
          <div className="table-container">
            {tableData.length === 0 ? (
              <span>{t("insurancePoliciesTableNoSearchData")}</span>
            ) : (
              <InfiniteScroll
                dataLength={policyList.length}
                next={loadMorePolicies}
                hasMore={hasMore}
                loader={
                  <span className="infinite-scroll-span">{t("insurancePoliciesTableLoading")}</span>
                }
                endMessage={
                  <span className="infinite-scroll-span">
                    {t("insurancePoliciesTableNoItemsToLoad")}
                  </span>
                }
                key={key}
              >
                <Table
                  headers={tableHeaders}
                  data={tableData}
                  showEdit={roles === USER_ROLES.ADMIN}
                  onEdit={roles === USER_ROLES.ADMIN ? handleEditPolicyButtonClick : undefined}
                  showDelete={roles === USER_ROLES.ADMIN}
                  onDelete={roles === USER_ROLES.ADMIN ? handleDeletePolicyButtonClick : undefined}
                />
              </InfiniteScroll>
            )}
          </div>
        </div>
      )}

      {modalOpenDeletePolicy && (
        <ConfirmationModal
          headerText={t("insurancePoliciesModalDeletePolicyHeaderTxt")}
          bodyText={t("insurancePoliciesModalDeletePolicyBodyTxt")}
          confirmBtnLabel={t("insurancePoliciesModalDeletePolicyConfirmBtnTxt")}
          itemId={itemToDelete}
          onConfirm={handleDeletePolicy}
          onClose={() => setModalOpenDeletePolicy(false)}
        />
      )}
      {modalOpenExport && (
        <ExportModal
          headerText={t("insurancePoliciesModalExportHeaderTxt")}
          onExport={handleExportPolicies}
          onClose={() => setModalOpenExport(false)}
        />
      )}
    </>
  );
};
