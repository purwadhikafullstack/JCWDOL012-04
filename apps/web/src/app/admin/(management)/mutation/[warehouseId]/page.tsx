'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/store/auth/auth.provider';
import { fetchData, updateData } from '@/utils/api';
import { MutationsModel } from '@/model/MutationsModel';
import { Loading } from '@/components/Loading';
import { MutationFormModal } from '@/components/admin/warehouse/mutation/modal-form';

export default function Mutation({
  params,
}: {
  params: { warehouseId: number };
}) {
  const [mutations, setMutations] = useState<MutationsModel[]>([]);
  const [incomingMutations, setIncomingMutations] = useState<MutationsModel[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formModal, setFormModal] = useState<boolean>(false);
  const auth = useAuth();
  const isAuthenticated = auth?.user?.isAuthenticated;
  const role = auth?.user?.data?.role;
  const isAuthorLoading = auth?.isLoading;
  const warehouseId =
    role === 'SUPER_ADMIN'
      ? params.warehouseId
      : auth?.user.data?.wareHouseAdmin_warehouseId;
  async function fetchIncomingMutations() {
    try {
      const response = await fetchData(
        `admin/incoming-mutation/${params.warehouseId}`,
      );
      setIncomingMutations(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  async function fetchMutations() {
    try {
      const response = await fetchData(`admin/mutation/${params.warehouseId}`);
      setMutations(response);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchMutations();
    fetchIncomingMutations();
  }, [params.warehouseId]);
  const handleMutationRequest = async (
    mutationId: number,
    productId: number,
    warehouseId: number,
    destinationWarehouseId: number,
    isAccepted: boolean,
    quantity: number,
  ) => {
    try {
      await updateData(
        '/admin/mutation',
        {
          mutationId,
          productId,
          warehouseId,
          destinationWarehouseId,
          isAccepted,
          quantity,
        },
        'application/json',
      );
      fetchIncomingMutations();
    } catch (error) {
      console.log(error);
    }
  };
  if (isAuthorLoading) return <Loading />;
  if (
    !isAuthenticated ||
    role === 'CUSTOMER' ||
    warehouseId != params.warehouseId
  )
    return (
      <div className="w-full h-screen flex justify-center items-center text-xl font-semibold">
        Unauthorized | 401
      </div>
    );
  return (
    <div className="flex flex-col xl:flex-row w-full max-w-[1440px] mx-auto min-h-[700px] pt-5 px-4 md:px-0">
      <div
        id="mutation-request-sent"
        className="flex flex-col xl:w-1/2 md:px-2 xl:px-5 2xl:px-10"
      >
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">Sent Mutation Request</div>
          <div
            className="text-white mb-1 cursor-pointer px-4 py-1 rounded hover:opacity-70 duration-100 bg-[var(--primaryColor)]"
            onClick={() => {
              setFormModal(true);
            }}
          >
            + New
          </div>
        </div>
        <hr className="mt-1 border-[var(--primaryColor)]" />
        {isLoading ? (
          <Loading />
        ) : (
          <table className="mt-4 table-auto shadow-md">
            <thead className="bg-gray-300 text-left">
              <tr>
                <th className="py-3 pl-3 hidden md:table-cell rounded-tl-md">
                  No.
                </th>
                <th className="py-3 pl-1 rounded-tl-md md:rounded-tl-none">
                  Product
                </th>
                <th className="py-3 pl-1">Qty</th>
                <th className="py-3 pl-1">Warehouse</th>
                <th className="py-3 pl-1 rounded-tr-md">Status</th>
              </tr>
            </thead>
            <tbody className="bg-gray-100">
              {mutations.map((mutation, index) => {
                return (
                  <tr key={index}>
                    <td className="pl-3 py-3 hidden md:flex">{index + 1}</td>
                    <td className="pl-1 py-3">{mutation.product?.name}</td>
                    <td className="pl-1 py-3">{mutation.quantity}</td>
                    <td className="pl-1 py-3">
                      {mutation.destinationWarehouse?.name}
                    </td>
                    <td
                      className={`px-1 py-2 ${
                        mutation.isAccepted === null
                          ? 'text-yellow-600'
                          : mutation.isAccepted
                            ? 'text-green-600'
                            : 'text-red-600'
                      }`}
                    >
                      {mutation.isAccepted === null
                        ? 'Pending'
                        : mutation.isAccepted
                          ? 'Accepted'
                          : 'Rejected'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div
        id="mutation-request"
        className="flex flex-col mt-10 xl:mt-0 xl:w-1/2 md:px-2 2xl:px-10"
      >
        <div className="text-xl font-semibold">Incoming Mutation Request</div>
        <hr className="mt-2 border-[var(--primaryColor)]" />
        <div className="flex flex-col mt-5">
          {isLoading ? (
            <Loading />
          ) : (
            incomingMutations.map((incomingMutation, index) => {
              return (
                <div key={index} className="flex flex-col mb-6">
                  <div className="bg-gray-300 font-semibold w-[230px] rounded-tl-[2000px] rounded-tr-full pl-5 h-7 flex items-center truncate">
                    {incomingMutation.warehouse?.name}
                  </div>
                  <div className="flex items-center justify-between h-28 md:h-16 rounded-r-full shadow border bg-gray-50 px-5">
                    <div>{incomingMutation.product?.name}</div>
                    <div>Qty : {incomingMutation.quantity}</div>
                    <div>
                      {new Date(
                        incomingMutation.createdAt,
                      ).toLocaleDateString()}
                    </div>
                    {incomingMutation.isAccepted === null ? (
                      <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row items-center md:space-x-3">
                        <div
                          className="bg-red-600 text-white px-3 pr-5 md:pr-4 md:px-4 py-2 rounded-tr-full md:rounded-full cursor-pointer hover:opacity-70 duration-100"
                          onClick={() => {
                            handleMutationRequest(
                              incomingMutation.id,
                              incomingMutation.productId,
                              incomingMutation.warehouseId,
                              incomingMutation.destinationWarehouseId,
                              false,
                              incomingMutation.quantity,
                            );
                          }}
                        >
                          Decline
                        </div>
                        <div
                          className="bg-green-600 text-white px-3 pr-5 md:pr-4 md:px-4 py-2 rounded-br-full md:rounded-full cursor-pointer hover:opacity-70 duration-100"
                          onClick={() => {
                            handleMutationRequest(
                              incomingMutation.id,
                              incomingMutation.productId,
                              incomingMutation.warehouseId,
                              incomingMutation.destinationWarehouseId,
                              true,
                              incomingMutation.quantity,
                            );
                          }}
                        >
                          Accept
                        </div>
                      </div>
                    ) : incomingMutation.isAccepted ? (
                      <span className="text-green-600">Accepted</span>
                    ) : (
                      <span className="text-red-600">Declined</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <MutationFormModal
        isModalOpen={formModal}
        setIsModalOpen={setFormModal}
        warehouseId={params.warehouseId}
        fetchData={fetchMutations}
      />
    </div>
  );
}
